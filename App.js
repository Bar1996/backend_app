const express = require("express")
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const studentRoute = require("./routes/student_route");
const postRoute = require("./routes/post_route");
const bodyParser = require("body-parser");



const initApp =  () => {  
    const promise = new Promise( async (resolve, reject) => {
        const db = mongoose.connection;
        db.on("error", (err) => console.log(err));
        db.once("open", () => console.log("Connected to Database"));
        await mongoose.connect(process.env.DATABASE_URL)
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use("/student", studentRoute);
        app.use("/post", postRoute);
        resolve(app);
 });
 return promise;
};

module.exports = initApp;

