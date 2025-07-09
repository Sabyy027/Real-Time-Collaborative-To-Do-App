import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { registerUser, loginUser, getAllUsers } from '../controllers/userController.js';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', protect, getAllUsers); // New route to get all users

export default router;