import { Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AuthRequest } from '@/types';
import { Image } from '@/models/Image';
import { v4 as uuidv4 } from 'uuid';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
}).single('image');

export const uploadImageHandler = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No file uploaded',
      });
    }

    const { category, tags } = req.body;

    if (!category || !['model', 'dress'].includes(category)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid category. Must be "model" or "dress"',
      });
    }

    // Create local file URL
    const fileUrl = `/uploads/${req.file.filename}`;

    // Save to database
    const image = await Image.create({
      userId: req.user?._id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      cloudinaryId: req.file.filename, // Use filename as ID for local storage
      url: fileUrl,
      width: 0, // We'll set default values since we don't have image processing
      height: 0,
      category,
      tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : [],
    });

    res.status(201).json({
      status: 'success',
      message: 'Image uploaded successfully',
      data: {
        image,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to upload image',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getUserImages = async (req: AuthRequest, res: Response) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;

    const query: any = { userId: req.user?._id };
    if (category) {
      query.category = category;
    }

    const images = await Image.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Image.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        images,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get images',
    });
  }
};

export const getImageById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const image = await Image.findOne({
      _id: id,
      userId: req.user?._id,
    });

    if (!image) {
      return res.status(404).json({
        status: 'error',
        message: 'Image not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        image,
      },
    });
  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get image',
    });
  }
};

export const deleteImage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const image = await Image.findOne({
      _id: id,
      userId: req.user?._id,
    });

    if (!image) {
      return res.status(404).json({
        status: 'error',
        message: 'Image not found',
      });
    }

    // Delete local file
    const filePath = path.join(uploadsDir, image.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await Image.findByIdAndDelete(id);

    res.status(200).json({
      status: 'success',
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete image',
    });
  }
}; 