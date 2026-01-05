import type { Column, Task, Id } from "../types/types";
import TaskCard from "./TaskCard";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

interface Details {
  column: Column;
  tasks: Task[];
  addTask: (columnId: Id) => void;
}

export default function KanbanColumn({ column, tasks, addTask }: Details) {
    const {setNodeRef} = useDroppable({
        id: column.id,
    });
  return (
    <div ref={setNodeRef} className="flex flex-col bg-slate-200/60 w-80 min-h-40 rounded-2xl p-4 border border-slate-300 shadow-sm">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-5 px-1">
        <h2 className="font-bold text-slate-700 uppercase tracking-wider text-sm">
          {column.title}
        </h2>
        <span className="bg-slate-300 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">
          {tasks.length}
        </span>
      </div>

      {/* Sortable Task List */}
      <div className="flex flex-col gap-3 grow">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>

      {/* Action Button */}
      <button
        onClick={() => addTask(column.id)}
        className="mt-4 flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-slate-400 text-slate-600 hover:bg-slate-300 hover:border-slate-500 transition-all cursor-pointer font-medium"
      >
        <span className="text-lg">+</span> Add Task
      </button>
    </div>
  );
}