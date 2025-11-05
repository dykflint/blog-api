// backend/src/app.js
import express from 'express';
import cors from 'cors';
import postRoutes from './routes/postRoutes.js';
import authRoutes from './routes/authRoutes.js';
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
export default app;
