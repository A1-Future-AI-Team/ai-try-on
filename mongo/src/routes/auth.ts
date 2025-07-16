import express from 'express';
import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  validateRegister,
  validateLogin,
  validateUpdateProfile,
} from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, validateUpdateProfile, updateProfile);

export default router; 