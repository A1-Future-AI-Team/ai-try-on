export interface VirtualTryOnRequest {
    modelImageUrl: string;
    clothingImageUrl: string;
    sessionId: string;
}
export interface VirtualTryOnResult {
    success: boolean;
    resultImagePath?: string;
    error?: string;
    processingTime?: number;
}
export declare class AIService {
    private genAI;
    private isDevelopmentMode;
    constructor();
    processVirtualTryOn(request: VirtualTryOnRequest): Promise<VirtualTryOnResult>;
    private mockProcessVirtualTryOn;
    private downloadImage;
    private getImageMimeType;
    generateImageDescription(imageUrl: string): Promise<string>;
    isConfigured(): boolean;
}
export declare const aiService: AIService;
//# sourceMappingURL=aiService.d.ts.map