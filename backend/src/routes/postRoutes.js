// backend/src/routes/postRoutes.js
import express from 'express';
import {
  deletePost,
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
} from '../controllers/postController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { authorizePostOwner } from '../middlewares/authorization.js';

const router = express.Router();

// Public routes
router.get('/', getAllPosts);
router.get('/:id', getPostById);

// Protected routes
router.post('/', authenticateToken, createPost);
router.put('/:id', authenticateToken, authorizePostOwner, updatePost);
router.delete('/:id', authenticateToken, authorizePostOwner, deletePost);

export default router;
