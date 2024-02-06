const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student_controller");

router.get("/", studentController.getStudents);
router.get("/:id", studentController.getStudentById);

router.post("/", studentController.postStudents);

router.put("/:id", studentController.putStudents);

router.delete("/:id", studentController.deleteStudents);

module.exports = router;