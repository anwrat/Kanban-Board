import { arrayMove } from "@dnd-kit/sortable";
import type{ Task } from "../types/types";
import { useTasks } from "../context/TaskContext";
import KanbanColumn from "./column";
import { DndContext, DragOverlay, type DragEndEvent, PointerSensor, useSensor, useSensors, closestCorners } from "@dnd-kit/core";
import { useState } from "react";
import TaskCard from "./TaskCard";

export default function Board() {
  const { columns, tasks, addTask, setTasks } = useTasks();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  function handleDragStart(event:any){
    const {active} = event;
    const task = tasks.find((t)=>t.id === active.id);
    if(task) setActiveTask;
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    setTasks((tasks) => {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);

      // If dragging to a different column
      if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
        const updatedTasks = [...tasks];
        updatedTasks[activeIndex] = { 
          ...updatedTasks[activeIndex], 
          columnId: tasks[overIndex].columnId 
        };
        return arrayMove(updatedTasks, activeIndex, overIndex);
      }

      return arrayMove(tasks, activeIndex, overIndex);
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
        updatedTasks[activeIndex] = { 
          ...updatedTasks[activeIndex], 
          columnId: overId 
        };
        
        return arrayMove(updatedTasks, activeIndex, activeIndex);
      }
      return prevTasks;
    });
  }
}

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
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
        {activeTask ?(
            <div className="w-80">
                <TaskCard task={activeTask} isOverlay/>
            </div>
        ):null}
      </DragOverlay>
    </DndContext>
  );
}