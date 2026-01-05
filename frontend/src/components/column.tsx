import type{ Column, Task, Id } from "../types/types";

interface Details{
    column: Column;
    tasks: Task[];
    addTask: (columnId: Id)=> void;
}

export default function KanbanColumn({column,tasks,addTask}:Details){
    return(
        <div className="flex flex-col">
            <div className="font-bold">{column.title}</div>
            {/* Tasks */}
            <div>
                {tasks.map((task)=>(
                    <div key={task.id}>
                        {task.content}
                    </div>
                ))}
            </div>
            <button onClick={()=>addTask(column.id)} className="p-3 cursor-pointer hover:bg-gray-200">
                + Add Task
            </button>
        </div>
    );
}