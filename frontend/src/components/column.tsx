import type{ Column, Task } from "../types/types";

interface Details{
    column: Column;
    tasks: Task[];
}

export default function KanbanColumn({column,tasks}:Details){
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
            <button className="p-3 cursor-pointer hover:bg-gray-200">+ Add Task</button>
        </div>
    );
}