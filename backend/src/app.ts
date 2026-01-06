import express from "express";
import taskRoutes from './routes/task.routes.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

const corsOptions = {
    origin: process.env.FRONTEND_URL,
};

app.use(cors(corsOptions));

app.use('/task', taskRoutes);

export default app;