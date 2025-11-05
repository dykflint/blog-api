// backend/src/routes/postRoutes.js
import express from 'express';

import {
  deletePost,
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
} from '../controllers/postController.js';

const router = express.Router();

router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

export default router;
