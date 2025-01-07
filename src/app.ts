import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import commentRoutes from './routes/commentRoutes';
import postRoutes from './routes/postRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/comment', commentRoutes);
app.use('/post', postRoutes);

app.listen(port, () => {
  mongoose.connect(process.env.DATABASE_URL!)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

  console.log(`Server is running on port ${port}`);
});
