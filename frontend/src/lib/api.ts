import axios from "axios";
import type { Id, Task } from "../types/types";

const BASE = "http://localhost:5001";

const api = axios.create({
    baseURL: BASE
});

export function getAllTasks(){
    return api.get('/task/');
}

export function createTask(task:Task){
    return api.post('/tasks/',task);
}

export function deleteTask(id: Id){
    return api.delete(`/task/${id}`);
}

export function updateTask(id:Id, updates: Partial<Task>){
    return api.put(`/task/${id}`,updates);
}