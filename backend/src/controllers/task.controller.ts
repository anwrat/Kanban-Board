import type{ Request, Response } from "express";
import taskModel from "../models/task.model.js";

export const getAllTasks = async(req: Request, res: Response) =>{
    try{
        const tasks = await taskModel.find();
        res.status(200).json(tasks);
    }catch(err){
        console.log("Error while getting all tasks: ",err);
        res.status(500).json({message: "Internal Server Error while fetching tasks"});
    }
}

export const addTask = async(req: Request, res: Response) =>{
    try{
        const {id, columnId, content} = req.body;
        const newTask = new taskModel({id,columnId,content});
        await newTask.save();
        res.status(200).json({message: "Task created successfully"});
    }catch(err){
        console.log("Error while adding task ",err);
        res.status(500).json({message:"Internal server error while adding task"});
    }
}

export const deleteTask = async (req: Request, res: Response) =>{
    try{
        const {id} = req.params;
        const deletedTask = await taskModel.findOneAndDelete({id:id as string});
        if(!deletedTask){
            return res.status(404).json({message:"Task not found"});
        }
        res.status(200).json({message:"Task deleted successfully;"})
    }catch(err){
        console.log("Error while deleting task ",err);
        res.status(500).json({message:"Internal server error while deleting task"});
    }
}

export const updateTask = async(req: Request, res: Response) =>{
    try{
        const {id} = req.params;
        const data = req.body;
        const updatedTask = await taskModel.findOneAndUpdate({id:id as string},data);
        if(!updatedTask){
            return res.status(404).json({message: "Task not found"});
        }
        res.status(200).json({message: "Task updated successfully"});
    }catch(err){
        console.log("Error while updating task ",err);
        res.status(500).json({message:"Internal server error while updating task"});
    }
}