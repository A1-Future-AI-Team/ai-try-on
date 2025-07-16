import { Response } from 'express';
import { AuthRequest } from '../types';
import { TryOnSession } from '../models/TryOnSession';
import { Image } from '../models/Image';
import { v4 as uuidv4 } from 'uuid';
import { aiService } from '../services/aiService';
import path from 'path';
import fs from 'fs';

export const createTryOnSession = async (req: AuthRequest, res: Response) => {
  try {
    const { modelImageId, dressImageId } = req.body;

    if (!modelImageId || !dressImageId) {
      return res.status(400).json({
        status: 'error',
        message: 'Model image ID and dress image ID are required',
      });
    }

    // Check if AI service is configured
    if (!aiService.isConfigured()) {
      return res.status(503).json({
        status: 'error',
        message: 'AI service is not configured. Please check your API key.',
      });
    }

    // Verify that both images exist and belong to the user
    const [modelImage, dressImage] = await Promise.all([
      Image.findOne({ _id: modelImageId, userId: req.user?._id, category: 'model' }),
      Image.findOne({ _id: dressImageId, userId: req.user?._id, category: 'dress' }),
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

    // Generate unique session ID
    const sessionId = uuidv4();

    // Create try-on session
    const tryOnSession = await TryOnSession.create({
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

    // Start AI processing in the background
    processVirtualTryOn((tryOnSession._id as any).toString(), sessionId, modelImage.url, dressImage.url);
    
    return res.status(201).json({
      status: 'success',
      message: 'Try-on session created successfully. Processing started.',
      data: {
        session: tryOnSession,
      },
    });
  } catch (error) {
    console.error('Create try-on session error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create try-on session',
    });
  }
};

// Background processing function
async function processVirtualTryOn(sessionDbId: string, sessionId: string, modelImageUrl: string, dressImageUrl: string) {
  try {
    // Update status to processing
    await TryOnSession.findByIdAndUpdate(sessionDbId, {
      status: 'processing',
      processingStartedAt: new Date(),
    });

    // Process with AI
    const result = await aiService.processVirtualTryOn({
      modelImageUrl,
      clothingImageUrl: dressImageUrl,
      sessionId,
    });

    if (result.success && result.resultImagePath) {
      // Create Image record for the result
      const resultImage = await Image.create({
        userId: (await TryOnSession.findById(sessionDbId))?.userId,
        originalName: `tryon_result_${sessionId}.jpg`,
        filename: path.basename(result.resultImagePath),
        mimetype: 'image/jpeg',
        size: fs.statSync(result.resultImagePath).size,
        cloudinaryId: `tryon_result_${sessionId}`,
        url: `/uploads/results/${path.basename(result.resultImagePath)}`,
        width: 512, // Default width, you could get this from the actual image
        height: 512, // Default height, you could get this from the actual image
        category: 'result',
        tags: ['virtual-try-on', 'ai-generated'],
      });

      // Update session with result
      await TryOnSession.findByIdAndUpdate(sessionDbId, {
        status: 'completed',
        processingCompletedAt: new Date(),
        resultImageId: resultImage._id,
        'metadata.resultImageUrl': resultImage.url,
      });
    } else {
      // Update session with error
      await TryOnSession.findByIdAndUpdate(sessionDbId, {
        status: 'failed',
        processingCompletedAt: new Date(),
        errorMessage: result.error || 'AI processing failed',
      });
    }
  } catch (error) {
    console.error('Background processing error:', error);
    await TryOnSession.findByIdAndUpdate(sessionDbId, {
      status: 'failed',
      processingCompletedAt: new Date(),
      errorMessage: 'Processing failed due to server error',
    });
  }
}

export const getTryOnSessions = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const query: any = { userId: req.user?._id };
    if (status) {
      query.status = status;
    }

    const sessions = await TryOnSession.find(query)
      .populate('modelImageId', 'url originalName')
      .populate('dressImageId', 'url originalName')
      .populate('resultImageId', 'url originalName')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await TryOnSession.countDocuments(query);

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
  } catch (error) {
    console.error('Get try-on sessions error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get try-on sessions',
    });
  }
};

export const getTryOnSessionById = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;

    const session = await TryOnSession.findOne({
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
  } catch (error) {
    console.error('Get try-on session error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get try-on session',
    });
  }
};

export const updateTryOnSessionStatus = async (req: AuthRequest, res: Response) => {
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

    const updateData: any = {
      status,
      ...(errorMessage && { errorMessage }),
      ...(resultImageId && { resultImageId }),
    };

    if (status === 'processing') {
      updateData.processingStartedAt = new Date();
    } else if (status === 'completed' || status === 'failed') {
      updateData.processingCompletedAt = new Date();
    }

    const session = await TryOnSession.findOneAndUpdate(
      { sessionId, userId: req.user?._id },
      updateData,
      { new: true }
    ).populate('modelImageId dressImageId resultImageId');

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
  } catch (error) {
    console.error('Update try-on session error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update try-on session',
    });
  }
};

export const deleteTryOnSession = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;

    const session = await TryOnSession.findOneAndDelete({
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
  } catch (error) {
    console.error('Delete try-on session error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete try-on session',
    });
  }
};

// Download result image
export const downloadResultImage = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;

    const session = await TryOnSession.findOne({
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

    const resultImage = session.resultImageId as any;
    const imagePath = path.join(process.cwd(), 'uploads', 'results', resultImage.filename);

    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({
        status: 'error',
        message: 'Result image file not found on server',
      });
    }

    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename="tryon_result_${sessionId}.jpg"`);
    res.setHeader('Content-Type', 'image/jpeg');

    // Stream the file
    const fileStream = fs.createReadStream(imagePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Download result image error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to download result image',
    });
  }
};

// Serve result images for viewing (not download)
export const serveResultImage = async (req: AuthRequest, res: Response) => {
  try {
    const { filename } = req.params;

    // Find the image by filename
    const image = await Image.findOne({
      filename: filename,
      category: 'result',
    });

    if (!image) {
      return res.status(404).json({
        status: 'error',
        message: 'Image not found',
      });
    }

    // Verify user owns this image through a session
    const session = await TryOnSession.findOne({
      resultImageId: image._id,
      userId: req.user?._id,
    });

    if (!session) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied',
      });
    }

    // For local files, construct the path
    const imagePath = path.join(process.cwd(), 'uploads', 'results', filename);

    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({
        status: 'error',
        message: 'Image file not found on server',
      });
    }

    // Set headers for viewing
    res.setHeader('Content-Type', image.mimetype);
    res.setHeader('Cache-Control', 'public, max-age=31536000');

    // Stream the file
    const fileStream = fs.createReadStream(imagePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Serve result image error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to serve result image',
    });
  }
}; 