import mongoose, { Document } from 'mongoose';
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
export declare const Image: mongoose.Model<IImage, {}, {}, {}, mongoose.Document<unknown, {}, IImage, {}> & IImage & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Image.d.ts.map