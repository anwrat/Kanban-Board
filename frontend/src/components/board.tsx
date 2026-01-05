import { arrayMove } from "@dnd-kit/sortable";
import type { Task } from "../types/types";
import { useTasks } from "../context/TaskContext";
import KanbanColumn from "./KanbanColumn";
import { 
  DndContext, 
  DragOverlay, 
  type DragEndEvent, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  closestCorners 
} from "@dnd-kit/core";
import { useState } from "react";
import TaskCard from "./TaskCard";
import * as api from '../lib/api';

export default function Board() {
  const { columns, tasks, addTask, setTasks, isLoading } = useTasks();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  function handleDragStart(event: any) {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);
    
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === overId);
    
    let newColumnId = activeTask?.columnId;
    
    if (overTask) {
        newColumnId = overTask.columnId;
    } else {
        newColumnId = overId as string;
    }

    if (activeTask && activeTask.columnId !== newColumnId) {
        try {
        await api.updateTask(activeId, { columnId: newColumnId });
        } catch (err) {
        console.error("Failed to save to backend:", err);
        }
    }

    setTasks((prev) => {
        const activeIndex = prev.findIndex((t) => t.id === activeId);
        const overIndex = prev.findIndex((t) => t.id === overId);

        const updatedTasks = [...prev];
        
        updatedTasks[activeIndex] = { 
        ...updatedTasks[activeIndex], 
        columnId: newColumnId as string 
        };

        if (overIndex !== -1) {
            return arrayMove(updatedTasks, activeIndex, overIndex);
        }
        return updatedTasks;
    });
    }

  function handleDragOver(event: any) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    const isOverAColumn = columns.some((col) => col.id === overId);

    if (isOverAColumn) {
      setTasks((prevTasks) => {
        const activeIndex = prevTasks.findIndex((t) => t.id === activeId);
        if (prevTasks[activeIndex].columnId !== overId) {
          const updatedTasks = [...prevTasks];
          updatedTasks[activeIndex] = { ...updatedTasks[activeIndex], columnId: overId as string };
          return arrayMove(updatedTasks, activeIndex, activeIndex);
        }
        return prevTasks;
      });
    }
  }

  if (isLoading) return <div className="flex h-screen items-center justify-center font-bold">Loading...</div>;

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCorners} 
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd} 
      onDragOver={handleDragOver}
    >
      <div className="min-h-screen w-full flex flex-col items-center py-10">
        <div className="items-center mb-16 flex flex-col text-center">
          <h1 className="font-bold text-6xl tracking-tight">Kanban Board</h1>
          <p className="text-slate-500 mt-2 font-medium">by Anwesh Rawat</p>
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

      <DragOverlay>
        {activeTask ? (
          <div className="w-80">
            <TaskCard task={activeTask} isOverlay />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}