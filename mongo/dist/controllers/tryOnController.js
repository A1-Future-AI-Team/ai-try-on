"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveResultImage = exports.downloadResultImage = exports.deleteTryOnSession = exports.updateTryOnSessionStatus = exports.getTryOnSessionById = exports.getTryOnSessions = exports.createTryOnSession = void 0;
const TryOnSession_1 = require("../models/TryOnSession");
const Image_1 = require("../models/Image");
const uuid_1 = require("uuid");
const aiService_1 = require("../services/aiService");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const createTryOnSession = async (req, res) => {
    try {
        const { modelImageId, dressImageId } = req.body;
        if (!modelImageId || !dressImageId) {
            return res.status(400).json({
                status: 'error',
                message: 'Model image ID and dress image ID are required',
            });
        }
        if (!aiService_1.aiService.isConfigured()) {
            return res.status(503).json({
                status: 'error',
                message: 'AI service is not configured. Please check your API key.',
            });
        }
        const [modelImage, dressImage] = await Promise.all([
            Image_1.Image.findOne({ _id: modelImageId, userId: req.user?._id, category: 'model' }),
            Image_1.Image.findOne({ _id: dressImageId, userId: req.user?._id, category: 'dress' }),
        ]);
        if (!modelImage) {
            return res.status(404).json({
                status: 'error',
                message: 'Model image not found',
            });
        }
        if (!dressImage) {
            return res.status(404).json({
                status: 'error',
                message: 'Dress image not found',
            });
        }
        const sessionId = (0, uuid_1.v4)();
        const tryOnSession = await TryOnSession_1.TryOnSession.create({
            userId: req.user?._id,
            sessionId,
            modelImageId,
            dressImageId,
            status: 'pending',
            metadata: {
                modelImageUrl: modelImage.url,
                dressImageUrl: dressImage.url,
            },
        });
        processVirtualTryOn(tryOnSession._id.toString(), sessionId, modelImage.url, dressImage.url);
        return res.status(201).json({
            status: 'success',
            message: 'Try-on session created successfully. Processing started.',
            data: {
                session: tryOnSession,
            },
        });
    }
    catch (error) {
        console.error('Create try-on session error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to create try-on session',
        });
    }
};
exports.createTryOnSession = createTryOnSession;
async function processVirtualTryOn(sessionDbId, sessionId, modelImageUrl, dressImageUrl) {
    try {
        await TryOnSession_1.TryOnSession.findByIdAndUpdate(sessionDbId, {
            status: 'processing',
            processingStartedAt: new Date(),
        });
        const result = await aiService_1.aiService.processVirtualTryOn({
            modelImageUrl,
            clothingImageUrl: dressImageUrl,
            sessionId,
        });
        if (result.success && result.resultImagePath) {
            const resultImage = await Image_1.Image.create({
                userId: (await TryOnSession_1.TryOnSession.findById(sessionDbId))?.userId,
                originalName: `tryon_result_${sessionId}.jpg`,
                filename: path_1.default.basename(result.resultImagePath),
                mimetype: 'image/jpeg',
                size: fs_1.default.statSync(result.resultImagePath).size,
                cloudinaryId: `tryon_result_${sessionId}`,
                url: `/uploads/results/${path_1.default.basename(result.resultImagePath)}`,
                width: 512,
                height: 512,
                category: 'result',
                tags: ['virtual-try-on', 'ai-generated'],
            });
            await TryOnSession_1.TryOnSession.findByIdAndUpdate(sessionDbId, {
                status: 'completed',
                processingCompletedAt: new Date(),
                resultImageId: resultImage._id,
                'metadata.resultImageUrl': resultImage.url,
            });
        }
        else {
            await TryOnSession_1.TryOnSession.findByIdAndUpdate(sessionDbId, {
                status: 'failed',
                processingCompletedAt: new Date(),
                errorMessage: result.error || 'AI processing failed',
            });
        }
    }
    catch (error) {
        console.error('Background processing error:', error);
        await TryOnSession_1.TryOnSession.findByIdAndUpdate(sessionDbId, {
            status: 'failed',
            processingCompletedAt: new Date(),
            errorMessage: 'Processing failed due to server error',
        });
    }
}
const getTryOnSessions = async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        const query = { userId: req.user?._id };
        if (status) {
            query.status = status;
        }
        const sessions = await TryOnSession_1.TryOnSession.find(query)
            .populate('modelImageId', 'url originalName')
            .populate('dressImageId', 'url originalName')
            .populate('resultImageId', 'url originalName')
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));
        const total = await TryOnSession_1.TryOnSession.countDocuments(query);
        return res.status(200).json({
            status: 'success',
            data: {
                sessions,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    totalPages: Math.ceil(total / Number(limit)),
                },
            },
        });
    }
    catch (error) {
        console.error('Get try-on sessions error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to get try-on sessions',
        });
    }
};
exports.getTryOnSessions = getTryOnSessions;
const getTryOnSessionById = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = await TryOnSession_1.TryOnSession.findOne({
            sessionId,
            userId: req.user?._id,
        })
            .populate('modelImageId', 'url originalName width height')
            .populate('dressImageId', 'url originalName width height')
            .populate('resultImageId', 'url originalName width height');
        if (!session) {
            return res.status(404).json({
                status: 'error',
                message: 'Try-on session not found',
            });
        }
        return res.status(200).json({
            status: 'success',
            data: {
                session,
            },
        });
    }
    catch (error) {
        console.error('Get try-on session error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to get try-on session',
        });
    }
};
exports.getTryOnSessionById = getTryOnSessionById;
const updateTryOnSessionStatus = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { status, errorMessage, resultImageId } = req.body;
        const validStatuses = ['pending', 'processing', 'completed', 'failed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid status',
            });
        }
        const updateData = {
            status,
            ...(errorMessage && { errorMessage }),
            ...(resultImageId && { resultImageId }),
        };
        if (status === 'processing') {
            updateData.processingStartedAt = new Date();
        }
        else if (status === 'completed' || status === 'failed') {
            updateData.processingCompletedAt = new Date();
        }
        const session = await TryOnSession_1.TryOnSession.findOneAndUpdate({ sessionId, userId: req.user?._id }, updateData, { new: true }).populate('modelImageId dressImageId resultImageId');
        if (!session) {
            return res.status(404).json({
                status: 'error',
                message: 'Try-on session not found',
            });
        }
        return res.status(200).json({
            status: 'success',
            message: 'Try-on session updated successfully',
            data: {
                session,
            },
        });
    }
    catch (error) {
        console.error('Update try-on session error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to update try-on session',
        });
    }
};
exports.updateTryOnSessionStatus = updateTryOnSessionStatus;
const deleteTryOnSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = await TryOnSession_1.TryOnSession.findOneAndDelete({
            sessionId,
            userId: req.user?._id,
        });
        if (!session) {
            return res.status(404).json({
                status: 'error',
                message: 'Try-on session not found',
            });
        }
        return res.status(200).json({
            status: 'success',
            message: 'Try-on session deleted successfully',
        });
    }
    catch (error) {
        console.error('Delete try-on session error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to delete try-on session',
        });
    }
};
exports.deleteTryOnSession = deleteTryOnSession;
const downloadResultImage = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = await TryOnSession_1.TryOnSession.findOne({
            sessionId,
            userId: req.user?._id,
            status: 'completed',
        }).populate('resultImageId');
        if (!session) {
            return res.status(404).json({
                status: 'error',
                message: 'Try-on session not found or not completed',
            });
        }
        if (!session.resultImageId) {
            return res.status(404).json({
                status: 'error',
                message: 'Result image not found',
            });
        }
        const resultImage = session.resultImageId;
        const imagePath = path_1.default.join(process.cwd(), 'uploads', 'results', resultImage.filename);
        if (!fs_1.default.existsSync(imagePath)) {
            return res.status(404).json({
                status: 'error',
                message: 'Result image file not found on server',
            });
        }
        res.setHeader('Content-Disposition', `attachment; filename="tryon_result_${sessionId}.jpg"`);
        res.setHeader('Content-Type', 'image/jpeg');
        const fileStream = fs_1.default.createReadStream(imagePath);
        fileStream.pipe(res);
    }
    catch (error) {
        console.error('Download result image error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to download result image',
        });
    }
};
exports.downloadResultImage = downloadResultImage;
const serveResultImage = async (req, res) => {
    try {
        const { filename } = req.params;
        const image = await Image_1.Image.findOne({
            filename: filename,
            category: 'result',
        });
        if (!image) {
            return res.status(404).json({
                status: 'error',
                message: 'Image not found',
            });
        }
        const session = await TryOnSession_1.TryOnSession.findOne({
            resultImageId: image._id,
            userId: req.user?._id,
        });
        if (!session) {
            return res.status(403).json({
                status: 'error',
                message: 'Access denied',
            });
        }
        const imagePath = path_1.default.join(process.cwd(), 'uploads', 'results', filename);
        if (!fs_1.default.existsSync(imagePath)) {
            return res.status(404).json({
                status: 'error',
                message: 'Image file not found on server',
            });
        }
        res.setHeader('Content-Type', image.mimetype);
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        const fileStream = fs_1.default.createReadStream(imagePath);
        fileStream.pipe(res);
    }
    catch (error) {
        console.error('Serve result image error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to serve result image',
        });
    }
};
exports.serveResultImage = serveResultImage;
//# sourceMappingURL=tryOnController.js.map