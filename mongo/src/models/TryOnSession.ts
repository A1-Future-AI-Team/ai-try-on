import mongoose, { Document, Schema } from 'mongoose';

export interface ITryOnSession extends Document {
  userId: mongoose.Types.ObjectId;
  sessionId: string;
  modelImageId: mongoose.Types.ObjectId;
  dressImageId: mongoose.Types.ObjectId;
  resultImageId?: mongoose.Types.ObjectId;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processingStartedAt?: Date;
  processingCompletedAt?: Date;
  errorMessage?: string;
  metadata: {
    modelImageUrl: string;
    dressImageUrl: string;
    resultImageUrl?: string;
    processingTime?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const tryOnSessionSchema = new Schema<ITryOnSession>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  sessionId: {
    type: String,
    required: [true, 'Session ID is required'],
  },
  modelImageId: {
    type: Schema.Types.ObjectId,
    ref: 'Image',
    required: [true, 'Model image ID is required'],
  },
  dressImageId: {
    type: Schema.Types.ObjectId,
    ref: 'Image',
    required: [true, 'Dress image ID is required'],
  },
  resultImageId: {
    type: Schema.Types.ObjectId,
    ref: 'Image',
    default: null,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
  },
  processingStartedAt: {
    type: Date,
    default: null,
  },
  processingCompletedAt: {
    type: Date,
    default: null,
  },
  errorMessage: {
    type: String,
    default: null,
  },
  metadata: {
    modelImageUrl: {
      type: String,
      required: [true, 'Model image URL is required'],
    },
    dressImageUrl: {
      type: String,
      required: [true, 'Dress image URL is required'],
    },
    resultImageUrl: {
      type: String,
      default: null,
    },
    processingTime: {
      type: Number,
      default: null,
    },
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
tryOnSessionSchema.index({ userId: 1, createdAt: -1 });
tryOnSessionSchema.index({ sessionId: 1 }, { unique: true });
tryOnSessionSchema.index({ status: 1 });

// Virtual for processing duration
tryOnSessionSchema.virtual('processingDuration').get(function() {
  if (this.processingStartedAt && this.processingCompletedAt) {
    return this.processingCompletedAt.getTime() - this.processingStartedAt.getTime();
  }
  return null;
});

export const TryOnSession = mongoose.model<ITryOnSession>('TryOnSession', tryOnSessionSchema); 