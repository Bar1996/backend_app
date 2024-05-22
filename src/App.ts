import express, {Express} from "express";
const app = express();
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import postRoute from "./routes/post_route";
import bodyParser from "body-parser";
import authRoute from "./routes/auth_route";
import fileRoute from "./routes/file_route";




const initApp =  () => {  
    const promise = new Promise<Express>(  (resolve) => {
        const db = mongoose.connection;
        db.on("error", (err) => console.log(err));
        db.once("open", () => console.log("Connected to Database"));
        mongoose.connect(process.env.DATABASE_URL).then(() => {
            app.use(bodyParser.urlencoded({extended: true, limit: '1mb'}))
            app.use(bodyParser.json());
            app.use("/post", postRoute);
            app.use("/auth", authRoute);
            app.use("/file", fileRoute);
            app.use('/uploads', express.static('uploads'));
            resolve(app);
        })
    });
    return promise;
};

export default initApp;