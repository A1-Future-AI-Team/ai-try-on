import { CloudinaryResponse } from '@/types';
export declare const uploadImage: (buffer: Buffer, folder: string, publicId?: string) => Promise<CloudinaryResponse>;
export declare const deleteImage: (publicId: string) => Promise<void>;
export declare const getImageUrl: (publicId: string, transformations?: any[]) => string;
export declare const generateThumbnail: (publicId: string, width?: number, height?: number) => string;
//# sourceMappingURL=cloudinary.d.ts.map