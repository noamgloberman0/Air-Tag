import
 mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  username: string;
  fullname: string;
  password: string;
  email: string;
}

const userSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  fullname: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

export default mongoose.model<IUser>('User', userSchema);
