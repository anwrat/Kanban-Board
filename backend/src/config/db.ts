import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URL = process.env.MONGODBURL as string;

const connectDB = async() =>{
    try{
        await mongoose.connect(MONGO_URL);
        console.log("Connected to database");
    } catch(err){
        console.error(err);
        process.exit(1);
    }
}

export default connectDB;


