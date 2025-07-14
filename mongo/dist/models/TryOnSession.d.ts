import mongoose, { Document } from 'mongoose';
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
export declare const TryOnSession: mongoose.Model<ITryOnSession, {}, {}, {}, mongoose.Document<unknown, {}, ITryOnSession, {}> & ITryOnSession & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=TryOnSession.d.ts.map