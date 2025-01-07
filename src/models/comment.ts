import
 mongoose, { Document, Schema }
 from 'mongoose';

interface IComment extends Document {
  message: string;
  sender: string;
  post: string;
  date: Date;
}

const commentSchema: Schema = new Schema({
  message: { type: String, required: true },
  sender: { type: String, required: true },
  post: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model<IComment>('Comment', commentSchema);
