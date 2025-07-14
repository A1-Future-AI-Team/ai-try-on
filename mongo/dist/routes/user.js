"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("@/middleware/auth");
const Image_1 = require("@/models/Image");
const TryOnSession_1 = require("@/models/TryOnSession");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.get('/stats', async (req, res) => {
    try {
        const userId = req.user?._id;
        const [totalImages, modelImages, dressImages, totalSessions, completedSessions, pendingSessions,] = await Promise.all([
            Image_1.Image.countDocuments({ userId }),
            Image_1.Image.countDocuments({ userId, category: 'model' }),
            Image_1.Image.countDocuments({ userId, category: 'dress' }),
            TryOnSession_1.TryOnSession.countDocuments({ userId }),
            TryOnSession_1.TryOnSession.countDocuments({ userId, status: 'completed' }),
            TryOnSession_1.TryOnSession.countDocuments({ userId, status: 'pending' }),
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
    }
    catch (error) {
        console.error('Get user stats error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to get user statistics',
        });
    }
});
router.get('/activity', async (req, res) => {
    try {
        const userId = req.user?._id;
        const { limit = 10 } = req.query;
        const [recentImages, recentSessions] = await Promise.all([
            Image_1.Image.find({ userId })
                .sort({ createdAt: -1 })
                .limit(Number(limit))
                .select('filename originalName category url createdAt'),
            TryOnSession_1.TryOnSession.find({ userId })
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
    }
    catch (error) {
        console.error('Get user activity error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to get user activity',
        });
    }
});
exports.default = router;
//# sourceMappingURL=user.js.map