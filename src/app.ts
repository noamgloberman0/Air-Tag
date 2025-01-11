import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import commentRoutes from './routes/commentRoutes';
import postRoutes from './routes/postRoutes';
import authRoutes from './routes/authRoutes';
import swaggerUI from "swagger-ui-express"
import swaggerJsDoc from "swagger-jsdoc"
import { authenticateToken } from './middleware/authMiddleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/comment', authenticateToken, commentRoutes);
app.use('/post', authenticateToken, postRoutes);
app.use('/auth', authRoutes);

if (process.env.NODE_ENV === 'development') {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Web Dev 2022 REST API',
        version: '1.0.0',
        description: 'REST server including authentication using JWT',
      },
      servers: [
        {
          url: 'http://localhost:3000',
        },
      ],
    },
    apis: ['./src/routes/*.ts'],
  };

  const specs = swaggerJsDoc(options);
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
}

function startServer() {
  app.listen(port, () => {
    mongoose.connect(process.env.DATABASE_URL!)
      .then(() => console.log('MongoDB connected'))
      .catch(err => console.error('MongoDB connection error:', err));

    console.log(`Server is running on port ${port}`);
  });
}

// Only start the server if the environment is not 'test'
if (process.env.NODE_ENV !== 'test') {
  process.env.NODE_ENV = 'development';
  startServer();
}

export default app;
