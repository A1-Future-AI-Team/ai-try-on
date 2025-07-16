import { Response } from 'express';
import { AuthRequest } from '../types';
export declare const createTryOnSession: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getTryOnSessions: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getTryOnSessionById: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateTryOnSessionStatus: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteTryOnSession: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const downloadResultImage: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const serveResultImage: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=tryOnController.d.ts.map