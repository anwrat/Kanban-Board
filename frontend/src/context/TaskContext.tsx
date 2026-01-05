import { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import type{ Task, Column, Id } from "../types/types";
import * as api from '../lib/api';

interface TaskContextType {
  tasks: Task[];
  columns: Column[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addTask: (columnId: Id) => void;
  updateTask: (id: Id, content: string) => void;
  deleteTask: (id: Id) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const columns: Column[] = [
    { id: "todo", title: "To Do" },
    { id: "doing", title: "In Progress" },
    { id: "done", title: "Completed" },
  ];

  useEffect(() => {
    const getTasks = async() =>{
      try{
        const res = await api.getAllTasks();
        setTasks(res.data);
        setIsLoading(false);
      }catch(err){
        console.error("Failed to fetch tasks ",err);
        setIsLoading(false);
      }
    };
    getTasks();
  }, []);

  const addTask = (columnId: Id) => {
    const newTask: Task = { id: crypto.randomUUID(), columnId, content: "New Task" };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: Id, content: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, content } : t));
  };

  const deleteTask = (id: Id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <TaskContext.Provider value={{ tasks, setTasks, columns, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within a TaskProvider");
  return context;
};