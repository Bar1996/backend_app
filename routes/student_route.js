const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student_controller");

router.get("/", studentController.getStudent);

router.post("/", studentController.postStudent);

router.put("/", studentController.putStudent);

router.delete("/", studentController.deleteStudent);

module.exports = router;