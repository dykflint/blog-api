// backend/src/app.js
import express from 'express';
import cors from 'cors';
import postRoutes from './routes/postRoutes.js';
import authRoutes from './routes/authRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173', // change this to your frontend URL
    credentials: true, // if you want cookies or auth headers to work
  }),
);
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts', commentRoutes);
app.use('/api/categories', categoryRoutes);

export default app;
