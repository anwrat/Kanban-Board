import { useState } from "react";
import { 
  DndContext, 
  DragOverlay, 
  type DragEndEvent, 
  type DragOverEvent,
  PointerSensor, 
  useSensor, 
  useSensors, 
  closestCorners 
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import type { Task } from "../types/types";
import { useTasks } from "../context/TaskContext";
import KanbanColumn from "./KanbanColumn";
import TaskCard from "./TaskCard";
import * as api from '../lib/api';

export default function Board() {
  const { columns, tasks, addTask, setTasks, isLoading } = useTasks();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    })
  );

  function handleDragStart(event: any) {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === overId);

    if (!activeTask) return;

    const isOverAColumn = columns.some((col) => col.id === overId);

    if (isOverAColumn && activeTask.columnId !== overId) {
      setTasks((prev) => {
        const activeIndex = prev.findIndex((t) => t.id === activeId);
        const updated = [...prev];
        updated[activeIndex] = { ...updated[activeIndex], columnId: overId as string };
        
        return arrayMove(updated, activeIndex, updated.length - 1);
      });
    }

    if (overTask && activeTask.columnId !== overTask.columnId) {
      setTasks((prev) => {
        const activeIndex = prev.findIndex((t) => t.id === activeId);
        const overIndex = prev.findIndex((t) => t.id === overId);
        
        const updated = [...prev];
        updated[activeIndex] = { ...updated[activeIndex], columnId: overTask.columnId };
        
        return arrayMove(updated, activeIndex, overIndex);
      });
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);
    
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === overId);

    const newColumnId = overTask ? overTask.columnId : (overId as string);
    if (activeTask && (activeTask.columnId !== newColumnId || activeId !== overId)) {
      try {
        await api.updateTask(activeId as string, { columnId: newColumnId });
      } catch (err) {
        console.error("Failed to sync drag with backend:", err);
      }
    }

    setTasks((prev) => {
      const activeIndex = prev.findIndex((t) => t.id === activeId);
      const overIndex = prev.findIndex((t) => t.id === overId);

      if (activeIndex !== overIndex && overIndex !== -1) {
        return arrayMove(prev, activeIndex, overIndex);
      }
      return prev;
    });
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-pulse text-xl font-semibold text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCorners} 
      onDragStart={handleDragStart} 
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen w-full flex flex-col items-center py-10">
        <div className="items-center mb-16 flex flex-col text-center">
          <h1 className="font-bold text-6xl tracking-tight">Kanban Board</h1>
          <p className="text-slate-500 mt-2 font-medium italic">by Anwesh Rawat</p>
        </div>
        
        <div className="flex gap-8 px-10 overflow-x-auto w-full justify-center items-start">
          {columns.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              tasks={tasks.filter((t) => t.columnId === col.id)}
              addTask={addTask}
            />
          ))}
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div className="w-80">
            <TaskCard task={activeTask} isOverlay />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}