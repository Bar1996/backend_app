const express = require("express")
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const studentRoute = require("./routes/student_route");
const postRoute = require("./routes/post_route");
const bodyParser = require("body-parser");

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (err) => console.log(err));
db.once("open", () => console.log("Connected to Database"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/student", studentRoute);
app.use("/post", postRoute);


app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port http://localhost:${process.env.PORT}!`)
});

