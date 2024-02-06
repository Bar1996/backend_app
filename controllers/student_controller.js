const Student = require('../models/student_model');

const getStudents = (req, res) => {
    res.send("Student get");
};

const getStudentById = (req, res) => {
    console.log(req.params);
    res.send("Student by id");
};

const postStudents = async (req, res) => {
    console.log("Student post");
    try{
        const student = await Student.create(req.body);
        res.status(201).send(student);
    } catch (error){
        console.log(error);
        res.status(400).send(error.message);
    }
};

const putStudents = (req, res) => {
    res.send("Student put");
};

const deleteStudents = (req, res) => {
    res.send("Student delete");
};

module.exports = {
    getStudents,
    getStudentById,
    postStudents,
    putStudents,
    deleteStudents,
  };