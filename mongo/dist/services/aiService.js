"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiService = exports.AIService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const axios_1 = __importDefault(require("axios"));
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
const sharp_1 = __importDefault(require("sharp"));
dotenv_1.default.config();
let genAI = null;
if (process.env.GOOGLE_AI_API_KEY) {
    try {
        genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    }
    catch (error) {
        console.error('Failed to initialize Google AI:', error);
    }
}
class AIService {
    constructor() {
        this.isDevelopmentMode = process.env.NODE_ENV === 'development' && !process.env.GOOGLE_AI_API_KEY;
        if (!process.env.GOOGLE_AI_API_KEY) {
            if (this.isDevelopmentMode) {
                console.warn('🔧 Running in development mode without Google AI API key. Using mock AI processing.');
            }
            else {
                console.warn('Google AI API key not found. AI service will not be available.');
            }
        }
        else {
            this.genAI = genAI;
        }
    }
    async processVirtualTryOn(request) {
        const startTime = Date.now();
        try {
            if (this.isDevelopmentMode) {
                return await this.mockProcessVirtualTryOn(request, startTime);
            }
            if (!this.isConfigured()) {
                throw new Error('AI service is not properly configured');
            }
            if (!this.genAI) {
                throw new Error('AI model is not initialized');
            }
            const modelImageBuffer = await this.downloadImage(request.modelImageUrl);
            const clothingImageBuffer = await this.downloadImage(request.clothingImageUrl);
            const modelMimeType = this.getImageMimeType(modelImageBuffer);
            const clothingMimeType = this.getImageMimeType(clothingImageBuffer);
            if (!modelMimeType || !clothingMimeType) {
                throw new Error('Invalid image format. Please use JPEG, PNG, or WebP');
            }
            const modelImageBase64 = modelImageBuffer.toString('base64');
            const clothingImageBase64 = clothingImageBuffer.toString('base64');
            const prompt = "Create a photorealistic image of the person in the first image wearing the garment from the second image. " +
                "The garment should fit naturally on the person's body, maintaining their pose and body proportions. " +
                "Ensure the lighting and shadows match the original person image. " +
                "The result should look like a real photograph, not a digital composite.";
            const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp-image-generation' });
            console.log("🎨 Calling Gemini AI for image generation...");
            const result = await Promise.race([
                model.generateContent({
                    contents: [
                        {
                            role: 'user',
                            parts: [
                                { text: prompt },
                                {
                                    inlineData: {
                                        mimeType: modelMimeType,
                                        data: modelImageBase64
                                    }
                                },
                                {
                                    inlineData: {
                                        mimeType: clothingMimeType,
                                        data: clothingImageBase64
                                    }
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        responseModalities: ["TEXT", "IMAGE"]
                    }
                }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('AI processing timeout (60s)')), 60000))
            ]);
            let generatedImageBuffer = null;
            if (result.response.candidates && result.response.candidates[0]) {
                const candidate = result.response.candidates[0];
                if (candidate.content && candidate.content.parts) {
                    for (const part of candidate.content.parts) {
                        if (part.inlineData && part.inlineData.data) {
                            console.log("✅ Found generated image in Gemini response");
                            generatedImageBuffer = Buffer.from(part.inlineData.data, 'base64');
                            break;
                        }
                    }
                }
            }
            if (!generatedImageBuffer) {
                console.warn("⚠️ No image found in Gemini response, using fallback");
                generatedImageBuffer = modelImageBuffer;
            }
            const resultImageName = `tryon_result_${request.sessionId}_${(0, uuid_1.v4)()}.jpg`;
            const resultImagePath = path_1.default.join(process.cwd(), 'uploads', 'results', resultImageName);
            const resultsDir = path_1.default.dirname(resultImagePath);
            if (!fs_1.default.existsSync(resultsDir)) {
                fs_1.default.mkdirSync(resultsDir, { recursive: true });
            }
            await (0, sharp_1.default)(generatedImageBuffer)
                .jpeg({ quality: 90 })
                .toFile(resultImagePath);
            console.log("🎉 Successfully generated and saved try-on image");
            const processingTime = Date.now() - startTime;
            return {
                success: true,
                resultImagePath: resultImagePath,
                processingTime: processingTime
            };
        }
        catch (error) {
            console.error('AI processing error:', error);
            const processingTime = Date.now() - startTime;
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred during AI processing',
                processingTime: processingTime
            };
        }
    }
    async mockProcessVirtualTryOn(request, startTime) {
        try {
            console.log('🎭 Mock AI processing started for session:', request.sessionId);
            const processingDelay = Math.random() * 3000 + 2000;
            await new Promise(resolve => setTimeout(resolve, processingDelay));
            const modelImageBuffer = await this.downloadImage(request.modelImageUrl);
            const resultImageName = `tryon_result_${request.sessionId}_${(0, uuid_1.v4)()}.jpg`;
            const resultImagePath = path_1.default.join(process.cwd(), 'uploads', 'results', resultImageName);
            const resultsDir = path_1.default.dirname(resultImagePath);
            if (!fs_1.default.existsSync(resultsDir)) {
                fs_1.default.mkdirSync(resultsDir, { recursive: true });
            }
            await (0, sharp_1.default)(modelImageBuffer)
                .jpeg({ quality: 90 })
                .toFile(resultImagePath);
            const processingTime = Date.now() - startTime;
            console.log(`🎭 Mock AI processing completed in ${processingTime}ms`);
            return {
                success: true,
                resultImagePath: resultImagePath,
                processingTime: processingTime
            };
        }
        catch (error) {
            console.error('Mock AI processing error:', error);
            const processingTime = Date.now() - startTime;
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Mock AI processing failed',
                processingTime: processingTime
            };
        }
    }
    async downloadImage(url) {
        try {
            let fullUrl = url;
            if (url.startsWith('/')) {
                fullUrl = `http://localhost:8080${url}`;
            }
            const response = await axios_1.default.get(fullUrl, {
                responseType: 'arraybuffer',
                timeout: 30000,
                maxContentLength: 10 * 1024 * 1024,
            });
            return Buffer.from(response.data);
        }
        catch (error) {
            throw new Error(`Failed to download image from URL: ${url} (resolved to: ${url.startsWith('/') ? `http://localhost:8080${url}` : url})`);
        }
    }
    getImageMimeType(buffer) {
        if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
            return 'image/jpeg';
        }
        if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
            return 'image/png';
        }
        if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
            return 'image/webp';
        }
        return null;
    }
    async generateImageDescription(imageUrl) {
        if (this.isDevelopmentMode) {
            return 'Mock description: A stylish outfit that would look great on any model.';
        }
        try {
            if (!this.genAI) {
                throw new Error('AI model is not initialized');
            }
            const imageBuffer = await this.downloadImage(imageUrl);
            const mimeType = this.getImageMimeType(imageBuffer);
            if (!mimeType) {
                throw new Error('Invalid image format');
            }
            const imageBase64 = imageBuffer.toString('base64');
            const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const result = await model.generateContent([
                'Describe this image in detail, focusing on the clothing and style.',
                {
                    inlineData: {
                        mimeType: mimeType,
                        data: imageBase64
                    }
                }
            ]);
            return result.response.text();
        }
        catch (error) {
            console.error('Image description error:', error);
            return 'Unable to generate description';
        }
    }
    isConfigured() {
        if (this.isDevelopmentMode) {
            return true;
        }
        return !!process.env.GOOGLE_AI_API_KEY && !!this.genAI;
    }
}
exports.AIService = AIService;
exports.aiService = new AIService();
//# sourceMappingURL=aiService.js.map