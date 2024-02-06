const Student = require('../models/student_model');

const getStudents =  async (req, res) => {
    console.log("Student get");
    try {
        let student;
        if(req.query.name){
            student = await Student.find({name: req.query.name});
        }   else{
            student = await Student.find();
        }
        res.status(200).send(student);
    } catch (error){
        console.log(error);
        res.status(400).send(error.message);
    }
};

const getStudentById = async (req, res) => {
    console.log(req.params);
    try{
        const student = await Student.findById(req.params.id);
        if(!student){
            res.status(404).send("Student not found");
        }
        res.status(200).send(student);    

    }catch (error){
        console.log(error);
        res.status(400).send(error.message);
    }
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