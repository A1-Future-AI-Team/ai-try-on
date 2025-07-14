import mongoose, { Document, Schema } from 'mongoose';

export interface IImage extends Document {
  userId: mongoose.Types.ObjectId;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  cloudinaryId: string;
  url: string;
  width: number;
  height: number;
  category: 'model' | 'dress' | 'result';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const imageSchema = new Schema<IImage>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  filename: {
    type: String,
    required: [true, 'Filename is required'],
  },
  originalName: {
    type: String,
    required: [true, 'Original filename is required'],
  },
  mimetype: {
    type: String,
    required: [true, 'MIME type is required'],
    enum: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  },
  size: {
    type: Number,
    required: [true, 'File size is required'],
    max: [10485760, 'File size cannot exceed 10MB'], // 10MB in bytes
  },
  cloudinaryId: {
    type: String,
    required: [true, 'Cloudinary ID is required'],
  },
  url: {
    type: String,
    required: [true, 'Image URL is required'],
  },
  width: {
    type: Number,
    required: [true, 'Image width is required'],
  },
  height: {
    type: Number,
    required: [true, 'Image height is required'],
  },
  category: {
    type: String,
    enum: ['model', 'dress', 'result'],
    required: [true, 'Image category is required'],
  },
  tags: [{
    type: String,
    trim: true,
  }],
}, {
  timestamps: true,
});

// Indexes for better query performance
imageSchema.index({ userId: 1, category: 1 });
imageSchema.index({ createdAt: -1 });
imageSchema.index({ cloudinaryId: 1 }, { unique: true });

export const Image = mongoose.model<IImage>('Image', imageSchema); 