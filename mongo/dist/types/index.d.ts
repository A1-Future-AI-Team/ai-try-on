import { Request } from 'express';
export interface AuthRequest extends Request {
    user?: {
        _id: string;
        email: string;
        username: string;
        role: string;
    };
}
export interface ImageUpload {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}
export interface CloudinaryResponse {
    public_id: string;
    secure_url: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
}
export interface TryOnSessionData {
    userId: string;
    modelImageId: string;
    dressImageId: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    resultImageUrl?: string;
    createdAt: Date;
    completedAt?: Date;
}
export interface ApiResponse<T = any> {
    status: 'success' | 'error';
    message: string;
    data?: T;
    timestamp: string;
}
//# sourceMappingURL=index.d.ts.map