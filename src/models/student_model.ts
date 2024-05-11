import mongoose from "mongoose";


export interface IStudent {
  _id: string;
  name: string;
  imgUrl: string;
}

const studentSchema = new mongoose.Schema<IStudent>({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IStudent>("Student", studentSchema);