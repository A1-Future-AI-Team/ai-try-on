import { Response } from 'express';
import { AuthRequest } from '@/types';
export declare const upload: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const uploadImageHandler: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getUserImages: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getImageById: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteImage: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=uploadController.d.ts.map