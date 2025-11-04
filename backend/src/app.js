// backend/src/app.js
import express from 'express';
import cors from 'cors';
import postRouter from './routes/postRoutes.js';
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/posts', postRouter);
export default app;
