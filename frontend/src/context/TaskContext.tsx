import { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import type { Task, Column, Id } from "../types/types";
import * as api from '../lib/api';

interface TaskContextType {
  tasks: Task[];
  columns: Column[];
  isLoading: boolean;
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
    const getTasks = async () => {
      try {
        const res = await api.getAllTasks();
        setTasks(res.data);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      } finally {
        setIsLoading(false);
      }
    };
    getTasks();
  }, []); 

  const addTask = async (columnId: Id) => {
    const newTask: Task = { id: crypto.randomUUID(), columnId: columnId as string, content: "Click to edit" };
    try {
      await api.createTask(newTask);
      setTasks(prev => [...prev, newTask]);
    } catch (err) {
      alert("Error saving task to database");
    }
  };

  const updateTask = async (id: Id, content: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, content } : t));
    try {
      await api.updateTask(id, { content });
    } catch (err) {
      console.error("Failed to update task content", err);
    }
  };

  const deleteTask = async (id: Id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    try {
      await api.deleteTask(id);
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, setTasks, columns, addTask, updateTask, deleteTask, isLoading }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within a TaskProvider");
  return context;
};