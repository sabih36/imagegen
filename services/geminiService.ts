import { GoogleGenAI } from "@google/genai";
import { API_KEY } from '../apiKey';

if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
  // This is a safeguard to warn developers if the key is not set.
  console.warn("API_KEY not set in apiKey.ts. Image generation will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

export const generateImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
  // Provide a clear, user-facing error if the API key is missing.
  if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
    throw new Error("Configuration Error: Please add your API key to the apiKey.ts file.");
  }
  
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      throw new Error("No image was generated. The prompt may have been blocked due to safety policies. Please try a different prompt.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    if (error instanceof Error) {
        // Provide a more user-friendly message for common API errors
        if (error.message.includes('API key not valid')) {
            throw new Error('Authentication Error: The provided API key is not valid. Please check your key in apiKey.ts.');
        }
        if (error.message.includes('billed users')) {
            throw new Error('Account Issue: This feature requires a billing-enabled Google Cloud project. Please enable billing in your Google Cloud Console and try again.');
        }
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the image.");
  }
};