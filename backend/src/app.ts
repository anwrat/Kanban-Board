import express from "express";
import taskRoutes from './routes/task.routes.js';
import cors from 'cors';

const app = express();
app.use(express.json());

const corsOptions = {
    origin:"http://localhost:5173",
};

app.use(cors(corsOptions));

app.use('/task', taskRoutes);

export default app;