// backend/src/app.js
import express from 'express';
import cors from 'cors';
import postRoutes from './routes/postRoutes.js';
import authRoutes from './routes/authRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts', commentRoutes);
export default app;
