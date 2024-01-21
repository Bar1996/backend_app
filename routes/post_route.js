const express = require("express");
const router = express.Router();

router.get("/student", (req, res) => {
    res.send("Student get");
});

router.post("/student", (req, res) => {
    res.send("Student post");
});

router.put("/student", (req, res) => {
    res.send("Student put");
});

router.delete("/student", (req, res) => {
    res.send("Student delete");
});

module.exports = router;