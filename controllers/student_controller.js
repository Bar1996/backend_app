const getStudent = (req, res) => {
    res.send("Student get");
};

const postStudent = (req, res) => {
    res.send("Student post");
};

const putStudent = (req, res) => {
    res.send("Student put");
};

const deleteStudent = (req, res) => {
    res.send("Student delete");
};

module.exports = {getStudent, postStudent, putStudent, deleteStudent}