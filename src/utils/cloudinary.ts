import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from '@/types';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (
  buffer: Buffer,
  folder: string,
  publicId?: string
): Promise<CloudinaryResponse> => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      resource_type: 'image' as const,
      folder,
      public_id: publicId,
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    };

    cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            public_id: result.public_id,
            secure_url: result.secure_url,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
          });
        }
      }
    ).end(buffer);
  });
};

export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

export const getImageUrl = (publicId: string, transformations?: any[]): string => {
  return cloudinary.url(publicId, {
    secure: true,
    transformation: transformations,
  });
};

export const generateThumbnail = (publicId: string, width: number = 300, height: number = 300): string => {
  return cloudinary.url(publicId, {
    secure: true,
    transformation: [
      { width, height, crop: 'fill' },
      { quality: 'auto' },
      { fetch_format: 'auto' },
    ],
  });
}; 