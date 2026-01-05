import { Router } from "express";
import { getAllTasks,addTask, updateTask, deleteTask } from "../controllers/task.controller.js";

const router = Router();

router.get('/',getAllTasks);
router.post('/create',addTask);
router.put('/:id', updateTask);
router.delete('/:id',deleteTask);

export default router;