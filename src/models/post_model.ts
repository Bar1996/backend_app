import mongoose from "mongoose";

export interface IPost {
  text: string;
  owner: string;
  imgUrl?: string;
  timestamp: string;
}

const postSchema = new mongoose.Schema<IPost>({
  text: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
  },
    timestamp: {
        type: String,
        required: true,
    }
});

export default mongoose.model<IPost>("Post", postSchema);
