// backend/src/routes/categoryRoutes.js
import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { authorizeAdmin } from '../middlewares/authorization.js';

const router = express.Router();

// Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Protected routes (admin only)
router.post('/', authenticateToken, authorizeAdmin, createCategory);
router.put('/:id', authenticateToken, authorizeAdmin, updateCategory);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteCategory);

export default router;
