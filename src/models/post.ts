import
 mongoose, { Document, Schema
 } from 'mongoose';

interface IPost extends Document {
  message: string;
  sender: string;
  likes: number;
  _id: string;
}

const postSchema: Schema = new Schema({
  message: { type: String, required: true },
  sender: { type: String, required: true },
  likes: { type: Number, default: 0 },
  _id: { type: String, required: true }
});

export default mongoose.model<IPost>('Post', postSchema);
