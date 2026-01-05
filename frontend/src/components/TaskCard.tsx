import { useTasks } from "../context/TaskContext";
import type{ Task } from "../types/types";
import { useState } from "react";

export default function TaskCard({task}:{task:Task}){
    const {updateTask, deleteTask} = useTasks();
    const [isEditing, setIsEditing] = useState(false);

    if(isEditing){
        return(
            <textarea 
                value={task.content}
                onBlur={()=>setIsEditing(false)}
                onChange={(e)=>updateTask(task.id,e.target.value)}    
            />
        );
    }

    return(
        <div className="cursor-pointer flex gap-2 rounded-lg p-4" onClick={()=>setIsEditing(true)}>
            <p>{task.content}</p>
            <button 
                className="cursor-pointer"
                onClick={(e)=>{
                    e.stopPropagation();
                    deleteTask(task.id);
                }}>
                    ✕
            </button>
        </div>
    );
}