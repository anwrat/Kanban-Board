import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    id:{type: String, required: true, unique: true },
    columnId: {type: String, required: true},
    content: {type: String, required: true},
});

export default mongoose.model('Task',TaskSchema);