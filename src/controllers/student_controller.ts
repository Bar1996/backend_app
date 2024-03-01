import Student from '../models/student_model';
import baseController from './base_controller';
import { IStudent } from '../models/student_model';

class StudentController extends baseController<IStudent>{
    constructor(){
        super(Student);
    }
}

export default new StudentController();