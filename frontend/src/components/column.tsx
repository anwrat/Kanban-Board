import type{ Column, Task, Id } from "../types/types";

interface Details{
    column: Column;
    tasks: Task[];
}

export default function KanbanColumn({column,tasks}:Details){
    return(
        <div>
            <div className="font-bold">{column.title}</div>
            {/* Tasks */}
            <div>
                {tasks.map((task)=>(
                    <div key={task.id}>
                        {task.content}
                    </div>
                ))}
            </div>
        </div>
    );
}