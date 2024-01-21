const express = require("express")
const app = express();

const dotenv = require("dotenv").config();

const studentRoute = require("./routes/student_route");
const postRoute = require("./routes/post_route");

app.use("/student", studentRoute);
app.use("/post", postRoute);


app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port http://localhost:${process.env.PORT}!`)
});

