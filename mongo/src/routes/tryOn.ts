import express from 'express';
import {
  createTryOnSession,
  getTryOnSessions,
  getTryOnSessionById,
  updateTryOnSessionStatus,
  deleteTryOnSession,
  downloadResultImage,
  serveResultImage,
} from '../controllers/tryOnController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(protect);

// Create new try-on session
router.post('/', createTryOnSession);

// Get all user's try-on sessions
router.get('/', getTryOnSessions);

// Get specific try-on session
router.get('/:sessionId', getTryOnSessionById);

// Update try-on session status
router.put('/:sessionId/status', updateTryOnSessionStatus);

// Delete try-on session
router.delete('/:sessionId', deleteTryOnSession);

// Download result image
router.get('/:sessionId/download', downloadResultImage);

// Serve result images for viewing
router.get('/results/:filename', serveResultImage);

export default router; 