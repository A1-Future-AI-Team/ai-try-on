"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.getImageById = exports.getUserImages = exports.uploadImageHandler = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const Image_1 = require("../models/Image");
const uuid_1 = require("uuid");
const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${(0, uuid_1.v4)()}-${Date.now()}${path_1.default.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Not an image! Please upload only images.'));
    }
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
}).single('image');
const uploadImageHandler = async (req, res) => {
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
        const fileUrl = `/uploads/${req.file.filename}`;
        const image = await Image_1.Image.create({
            userId: req.user?._id,
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            cloudinaryId: req.file.filename,
            url: fileUrl,
            width: 0,
            height: 0,
            category,
            tags: tags ? tags.split(',').map((tag) => tag.trim()) : [],
        });
        return res.status(201).json({
            status: 'success',
            message: 'Image uploaded successfully',
            data: {
                image,
            },
        });
    }
    catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to upload image',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.uploadImageHandler = uploadImageHandler;
const getUserImages = async (req, res) => {
    try {
        const { category, page = 1, limit = 20 } = req.query;
        const query = { userId: req.user?._id };
        if (category) {
            query.category = category;
        }
        const images = await Image_1.Image.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));
        const total = await Image_1.Image.countDocuments(query);
        return res.status(200).json({
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
    }
    catch (error) {
        console.error('Get images error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to get images',
        });
    }
};
exports.getUserImages = getUserImages;
const getImageById = async (req, res) => {
    try {
        const { id } = req.params;
        const image = await Image_1.Image.findOne({
            _id: id,
            userId: req.user?._id,
        });
        if (!image) {
            return res.status(404).json({
                status: 'error',
                message: 'Image not found',
            });
        }
        return res.status(200).json({
            status: 'success',
            data: {
                image,
            },
        });
    }
    catch (error) {
        console.error('Get image error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to get image',
        });
    }
};
exports.getImageById = getImageById;
const deleteImage = async (req, res) => {
    try {
        const { id } = req.params;
        const image = await Image_1.Image.findOne({
            _id: id,
            userId: req.user?._id,
        });
        if (!image) {
            return res.status(404).json({
                status: 'error',
                message: 'Image not found',
            });
        }
        const filePath = path_1.default.join(uploadsDir, image.filename);
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
        await Image_1.Image.findByIdAndDelete(id);
        return res.status(200).json({
            status: 'success',
            message: 'Image deleted successfully',
        });
    }
    catch (error) {
        console.error('Delete image error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to delete image',
        });
    }
};
exports.deleteImage = deleteImage;
//# sourceMappingURL=uploadController.js.map