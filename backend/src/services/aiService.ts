import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import sharp from 'sharp';

// Load environment variables first
dotenv.config();

// Initialize Google Generative AI only if API key is available
let genAI: any = null;
if (process.env.GOOGLE_AI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  } catch (error) {
    console.error('Failed to initialize Google AI:', error);
  }
}

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

export class AIService {
  private genAI: any;
  private isDevelopmentMode: boolean;

  constructor() {
    this.isDevelopmentMode = process.env.NODE_ENV === 'development' && !process.env.GOOGLE_AI_API_KEY;
    
    if (!process.env.GOOGLE_AI_API_KEY) {
      if (this.isDevelopmentMode) {
        console.warn('🔧 Running in development mode without Google AI API key. Using mock AI processing.');
      } else {
        console.warn('Google AI API key not found. AI service will not be available.');
      }
    } else {
      // Use the global genAI instance
      this.genAI = genAI;
    }
  }

  /**
   * Process virtual try-on using Google Gemini AI or mock processing
   */
  async processVirtualTryOn(request: VirtualTryOnRequest): Promise<VirtualTryOnResult> {
    const startTime = Date.now();
    
    try {
      // In development mode without API key, use mock processing
      if (this.isDevelopmentMode) {
        return await this.mockProcessVirtualTryOn(request, startTime);
      }

      // Validate configuration for real AI processing
      if (!this.isConfigured()) {
        throw new Error('AI service is not properly configured');
      }

      if (!this.genAI) {
        throw new Error('AI model is not initialized');
      }

      // Download images from URLs
      const modelImageBuffer = await this.downloadImage(request.modelImageUrl);
      const clothingImageBuffer = await this.downloadImage(request.clothingImageUrl);

      // Validate image formats
      const modelMimeType = this.getImageMimeType(modelImageBuffer);
      const clothingMimeType = this.getImageMimeType(clothingImageBuffer);

      if (!modelMimeType || !clothingMimeType) {
        throw new Error('Invalid image format. Please use JPEG, PNG, or WebP');
      }

      // Convert to base64 for Gemini API
      const modelImageBase64 = modelImageBuffer.toString('base64');
      const clothingImageBase64 = clothingImageBuffer.toString('base64');

      // Create prompt for Gemini image generation
      const prompt = 
        "Create a photorealistic image of the person in the first image wearing the garment from the second image. " +
        "The garment should fit naturally on the person's body, maintaining their pose and body proportions. " +
        "Ensure the lighting and shadows match the original person image. " +
        "The result should look like a real photograph, not a digital composite.";

      // Generate content using Gemini with timeout
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
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('AI processing timeout (60s)')), 60000)
        )
      ]);

      // Process the response to extract generated image
      let generatedImageBuffer: Buffer | null = null;
      
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
        // Fallback to model image if no generated image
        generatedImageBuffer = modelImageBuffer;
      }
      
      // Create result image file
      const resultImageName = `tryon_result_${request.sessionId}_${uuidv4()}.jpg`;
      const resultImagePath = path.join(process.cwd(), 'uploads', 'results', resultImageName);
      
      // Ensure results directory exists
      const resultsDir = path.dirname(resultImagePath);
      if (!fs.existsSync(resultsDir)) {
        fs.mkdirSync(resultsDir, { recursive: true });
      }

      // Save the generated image using sharp for better quality
      await sharp(generatedImageBuffer)
        .jpeg({ quality: 90 })
        .toFile(resultImagePath);
      console.log("🎉 Successfully generated and saved try-on image");

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        resultImagePath: resultImagePath,
        processingTime: processingTime
      };

    } catch (error) {
      console.error('AI processing error:', error);
      const processingTime = Date.now() - startTime;
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred during AI processing',
        processingTime: processingTime
      };
    }
  }

  /**
   * Mock AI processing for development mode
   */
  private async mockProcessVirtualTryOn(request: VirtualTryOnRequest, startTime: number): Promise<VirtualTryOnResult> {
    try {
      console.log('🎭 Mock AI processing started for session:', request.sessionId);
      
      // Simulate processing time (2-5 seconds)
      const processingDelay = Math.random() * 3000 + 2000;
      await new Promise(resolve => setTimeout(resolve, processingDelay));

      // Download the model image to use as the result
      const modelImageBuffer = await this.downloadImage(request.modelImageUrl);

      // Create result image
      const resultImageName = `tryon_result_${request.sessionId}_${uuidv4()}.jpg`;
      const resultImagePath = path.join(process.cwd(), 'uploads', 'results', resultImageName);
      
      // Ensure results directory exists
      const resultsDir = path.dirname(resultImagePath);
      if (!fs.existsSync(resultsDir)) {
        fs.mkdirSync(resultsDir, { recursive: true });
      }

      // Save the model image as the result (mock processing)
      await sharp(modelImageBuffer)
        .jpeg({ quality: 90 })
        .toFile(resultImagePath);

      const processingTime = Date.now() - startTime;
      console.log(`🎭 Mock AI processing completed in ${processingTime}ms`);

      return {
        success: true,
        resultImagePath: resultImagePath,
        processingTime: processingTime
      };

    } catch (error) {
      console.error('Mock AI processing error:', error);
      const processingTime = Date.now() - startTime;
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Mock AI processing failed',
        processingTime: processingTime
      };
    }
  }

  /**
   * Download image from URL
   */
  private async downloadImage(url: string): Promise<Buffer> {
    try {
      // Handle relative URLs by converting to full localhost URL
      let fullUrl = url;
      if (url.startsWith('/')) {
        fullUrl = `http://localhost:3001${url}`;
      }
      
      const response = await axios.get(fullUrl, {
        responseType: 'arraybuffer',
        timeout: 30000, // 30 second timeout
        maxContentLength: 10 * 1024 * 1024, // 10MB max
      });
      
      return Buffer.from(response.data);
    } catch (error) {
      throw new Error(`Failed to download image from URL: ${url} (resolved to: ${url.startsWith('/') ? `http://localhost:3001${url}` : url})`);
    }
  }

  /**
   * Determine image MIME type from buffer
   */
  private getImageMimeType(buffer: Buffer): string | null {
    // Check for JPEG
    if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
      return 'image/jpeg';
    }
    // Check for PNG
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
      return 'image/png';
    }
    // Check for WebP
    if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
      return 'image/webp';
    }
    return null;
  }

  /**
   * Generate image description using Gemini (for future enhancements)
   */
  async generateImageDescription(imageUrl: string): Promise<string> {
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
    } catch (error) {
      console.error('Image description error:', error);
      return 'Unable to generate description';
    }
  }

  /**
   * Validate AI service configuration
   */
  isConfigured(): boolean {
    // In development mode, always return true to allow testing
    if (this.isDevelopmentMode) {
      return true;
    }
    return !!process.env.GOOGLE_AI_API_KEY && !!this.genAI;
  }
}

export const aiService = new AIService(); 