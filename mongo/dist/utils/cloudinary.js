"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateThumbnail = exports.getImageUrl = exports.deleteImage = exports.uploadImage = void 0;
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadImage = async (buffer, folder, publicId) => {
    return new Promise((resolve, reject) => {
        const uploadOptions = {
            resource_type: 'image',
            folder,
            public_id: publicId,
            transformation: [
                { quality: 'auto' },
                { fetch_format: 'auto' },
            ],
        };
        cloudinary_1.v2.uploader.upload_stream(uploadOptions, (error, result) => {
            if (error) {
                reject(error);
            }
            else if (result) {
                resolve({
                    public_id: result.public_id,
                    secure_url: result.secure_url,
                    width: result.width,
                    height: result.height,
                    format: result.format,
                    bytes: result.bytes,
                });
            }
        }).end(buffer);
    });
};
exports.uploadImage = uploadImage;
const deleteImage = async (publicId) => {
    try {
        await cloudinary_1.v2.uploader.destroy(publicId);
    }
    catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw error;
    }
};
exports.deleteImage = deleteImage;
const getImageUrl = (publicId, transformations) => {
    return cloudinary_1.v2.url(publicId, {
        secure: true,
        transformation: transformations,
    });
};
exports.getImageUrl = getImageUrl;
const generateThumbnail = (publicId, width = 300, height = 300) => {
    return cloudinary_1.v2.url(publicId, {
        secure: true,
        transformation: [
            { width, height, crop: 'fill' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
        ],
    });
};
exports.generateThumbnail = generateThumbnail;
//# sourceMappingURL=cloudinary.js.map