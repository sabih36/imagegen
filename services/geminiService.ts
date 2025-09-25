import { GoogleGenAI } from "@google/genai";

// This check is the new safeguard. If the API key is missing, this module
// will throw an error when it's dynamically imported. This prevents the
// app from crashing and allows the UI to display the error message gracefully.
if (!process.env.API_KEY) {
  throw new Error('Configuration Error: The API key is missing. Please ensure it is set up correctly in your environment configuration.');
}

// Initialize the client directly. The check above ensures the key exists.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

export const generateImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: aspectRatio,
        },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error("No image was generated. The response was empty.");
    }

    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return base64ImageBytes;

  } catch (error) {
    console.error("Error generating image:", error);
    if (error instanceof Error) {
        // Re-throw specific, user-friendly errors.
        if (error.message.includes('API key not valid') || error.message.includes('API_KEY_INVALID')) {
            throw new Error('Authentication Error: The API key is not valid. Please check your environment configuration.');
        }
        if (error.message.includes('billing')) {
             throw new Error('Account Issue: This feature requires a billing-enabled Google Cloud project. Please enable billing and try again.');
        }
        // Let the initial config error pass through from the top-level check.
        if (error.message.startsWith('Configuration Error')) {
            throw error;
        }
        throw new Error(`An unexpected error occurred: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the image.");
  }
};
