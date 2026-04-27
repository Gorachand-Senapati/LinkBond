//import all dependencies
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();//use for It is used to load environment variables from the .env file into process.env.

const app = express();//make express app
app.use(cors());//for origin
app.use(express.json());//for json data thsi line need befor routes because we need to convert json data into js object for use in controller
app.use(postRoutes);//use post routes in server.js for api call
app.use(userRoutes);//use user routes in server.js for api call
app.use(express.static("uploads"));//for static file like profile picture and pdf file access from uploads folder here go relative path of uploads folder because we need to access file from uploads folder


const start = async() => { //for mongodb async because it need some time
    try{
        await mongoose.connect(process.env.MONGO_URI);//connected with mongo db
        console.log("Connected to MongoDB");
        app.listen(process.env.PORT,() => {
            console.log(`App is listening on port ${process.env.PORT}`);//port connectiion in backend
        });
    } catch(error){
        console.error("database connection failed", error);
        console.error(error.message);
    }
   
};
start();