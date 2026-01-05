import { useTasks } from "../context/TaskContext";
import type { Task } from "../types/types";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function TaskCard({ task, isOverlay }: { task: Task, isOverlay?: boolean }) {
  const { updateTask, deleteTask } = useTasks();
  const [isEditing, setIsEditing] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled:isOverlay });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging && !isOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-40 bg-slate-300 border-2 border-blue-500 rounded-xl p-4 min-h-20"
      />
    );
  }

  const overlayClasses = isOverlay ? "ring-2 ring-blue-500 rotate-3 shadow-2xl scale-105":"";

  if (isEditing) {
    return (
      <textarea
        className="w-full bg-white text-black p-4 rounded-xl border-2 border-blue-500 focus:outline-none shadow-lg resize-none min-h-20"
        autoFocus
        value={task.content}
        onBlur={() => setIsEditing(false)}
        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) setIsEditing(false); }}
        onChange={(e) => updateTask(task.id, e.target.value)}
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => !isOverlay && setIsEditing(true)}
      className={`bg-white p-4 rounded-xl shadow-sm border border-slate-300 group flex justify-between items-start cursor-grab active:cursor-grabbing hover:border-blue-400 hover:ring-1 hover:ring-blue-400 transition-all ${overlayClasses}`}
    >
      <p className="text-slate-700 leading-relaxed wrap-break-word">{task.content}</p>
      <button
        className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          deleteTask(task.id);
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    </div>
  );
}