import express from 'express';
import {
  upload,
  uploadImageHandler,
  getUserImages,
  getImageById,
  deleteImage,
} from '../controllers/uploadController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(protect);

// Upload image
router.post('/', upload, uploadImageHandler);

// Get user's images
router.get('/', getUserImages);

// Get specific image
router.get('/:id', getImageById);

// Delete image
router.delete('/:id', deleteImage);

export default router; 