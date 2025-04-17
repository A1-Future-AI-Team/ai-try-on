import { GoogleGenAI } from "@google/genai";
import sharp from 'sharp';

export class GeminiTryOn {
    constructor() {
        const apiKey = "AIzaSyBo00GRHkn3OZrp8ESCGgr0rYhRUcIw0ro";
        if (!apiKey) {
            throw new Error("GOOGLE_API_KEY environment variable is not set. Please set it with your Gemini API key.");
        }
        
        this.ai = new GoogleGenAI({ apiKey });
        console.log("Initialized Gemini client");
    }

    async tryOn(personImagePath, garmentImagePath) {
        try {
            console.log("Starting virtual try-on process");
            
            // Read and process the uploaded images
            const personBuffer = await sharp(personImagePath)
                .resize(1024, 1024, { fit: 'inside' })
                .toBuffer();
            
            const garmentBuffer = await sharp(garmentImagePath)
                .resize(1024, 1024, { fit: 'inside' })
                .toBuffer();
            
            // Convert buffers to base64
            const personB64 = personBuffer.toString('base64');
            const garmentB64 = garmentBuffer.toString('base64');
            
            // Create prompt
            const prompt = 
                "Create a photorealistic image of the person in the first image wearing the garment from the second image. " +
                "The garment should fit naturally on the person's body, maintaining their pose and body proportions. " +
                "Ensure the lighting and shadows match the original person image. " +
                "The result should look like a real photograph, not a digital composite.";
            
            // Prepare contents for Gemini API
            const contents = [
                { text: prompt },
                { inlineData: { mimeType: "image/png", data: personB64 } },
                { inlineData: { mimeType: "image/png", data: garmentB64 } }
            ];
            
            // Generate image
            console.log("Calling Gemini API...");
            const response = await this.ai.models.generateContent({
                model: "gemini-2.0-flash-exp-image-generation",
                contents: contents,
                config: {
                    responseModalities: ["TEXT", "IMAGE"]
                }
            });
            
            // Process response
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const imageData = part.inlineData.data;
                    const resultBuffer = Buffer.from(imageData, "base64");
                    const resultPath = `uploads/result_${Date.now()}.png`;
                    await sharp(resultBuffer).toFile(resultPath);
                    console.log("Successfully generated try-on image");
                    return resultPath;
                }
            }
            
            throw new Error("No image in API response");
            
        } catch (error) {
            console.error("Error in virtual try-on:", error);
            throw error;
        }
    }
}

// Example usage
async function main() {
    try {
        // Initialize the try-on model
        const model = new GeminiTryOn();
        
        // Perform virtual try-on
        const resultPath = await model.tryOn("person.jpg", "cloth.jpg");
        console.log(`Saved result as ${resultPath}`);
        
    } catch (error) {
        console.error(`Error in main: ${error.message}`);
    }
}

main(); 