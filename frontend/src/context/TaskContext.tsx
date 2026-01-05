import { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import type{ Task, Column, Id } from "../types/types";

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
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("kanban-tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const columns: Column[] = [
    { id: "todo", title: "To Do" },
    { id: "doing", title: "In Progress" },
    { id: "done", title: "Completed" },
  ];

  useEffect(() => {
    localStorage.setItem("kanban-tasks", JSON.stringify(tasks));
  }, [tasks]);

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