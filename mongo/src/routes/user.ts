import express from 'express';
import { protect } from '../middleware/auth';
import { AuthRequest } from '../types';
import { Response } from 'express';
import { User } from '../models/User';
import { Image } from '../models/Image';
import { TryOnSession } from '../models/TryOnSession';

const router = express.Router();

// All routes are protected
router.use(protect);

// Get user statistics
router.get('/stats', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    const [
      totalImages,
      modelImages,
      dressImages,
      totalSessions,
      completedSessions,
      pendingSessions,
    ] = await Promise.all([
      Image.countDocuments({ userId }),
      Image.countDocuments({ userId, category: 'model' }),
      Image.countDocuments({ userId, category: 'dress' }),
      TryOnSession.countDocuments({ userId }),
      TryOnSession.countDocuments({ userId, status: 'completed' }),
      TryOnSession.countDocuments({ userId, status: 'pending' }),
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          images: {
            total: totalImages,
            model: modelImages,
            dress: dressImages,
          },
          sessions: {
            total: totalSessions,
            completed: completedSessions,
            pending: pendingSessions,
          },
        },
      },
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get user statistics',
    });
  }
});

// Get user's recent activity
router.get('/activity', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { limit = 10 } = req.query;

    const [recentImages, recentSessions] = await Promise.all([
      Image.find({ userId })
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .select('filename originalName category url createdAt'),
      TryOnSession.find({ userId })
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .populate('modelImageId', 'originalName')
        .populate('dressImageId', 'originalName')
        .select('sessionId status createdAt processingCompletedAt'),
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        recentImages,
        recentSessions,
      },
    });
  } catch (error) {
    console.error('Get user activity error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get user activity',
    });
  }
});

export default router; 