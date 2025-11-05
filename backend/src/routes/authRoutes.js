// backend/src/routes/authRoutes.js
import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { registerUser, loginUser, getProfile } from '../controllers/authController.js';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authenticateToken, getProfile);

export default router;
