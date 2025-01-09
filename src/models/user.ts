import
 mongoose, { Document, Schema }
 from 'mongoose';

interface IComment extends Document {
  username: string;
  fullname: string;
  password: string;
  email: string;
}

const userSchema: Schema = new Schema({
  username: { type: String, required: true },
  fullname: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
});

export default mongoose.model<IComment>('User', userSchema);
