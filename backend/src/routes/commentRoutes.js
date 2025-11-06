// backend/src/routes/commentRoutes.js
import express from 'express';
import {
  getCommentsForPost,
  createComment,
  updateComment,
  deleteComment,
} from '../controllers/commentController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Routes scoped under /api/posts/:postId/comments
router.get('/:postId/comments', getCommentsForPost);
router.post('/:postId/comments', createComment);

// For updating/deleting specific comments (by Comment ID)
router.put('/comments/:id', authenticateToken, updateComment);
router.delete('/comments/:id', authenticateToken, deleteComment);

export default router;
