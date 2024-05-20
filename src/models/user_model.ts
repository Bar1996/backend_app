import mongoose from "mongoose";

export interface IUser {
    email: string;
    password: string;
    imgUrl: string;
    tokens: string[];
    name: string;
    userType?: string;
}

const userSchema = new mongoose.Schema<IUser>({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    tokens: {
        type: [String],
         required: false
    },
    imgUrl: {
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true
    }
});

export default mongoose.model<IUser>("User", userSchema);