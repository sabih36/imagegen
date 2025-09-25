import { GoogleGenAI } from "@google/genai";

// Use a variable to hold the client instance, initialized lazily.
let ai: GoogleGenAI | null = null;

// This function safely initializes and returns the AI client.
// It is designed to be called only when needed, preventing startup crashes.
const getAiClient = (): GoogleGenAI => {
  if (!ai) {
    // Safely check for the API key from the environment.
    // This guard prevents a "process is not defined" ReferenceError in browser environments.
    const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : undefined;

    if (!apiKey) {
      // If the key is missing, throw a configuration error that will be caught and displayed in the UI.
      throw new Error('Configuration Error: The API key is missing. Please ensure it is set up correctly in your environment configuration.');
    }
    
    // Initialize the client only when the key is confirmed to be present.
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};


export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

export const generateImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
  try {
    // Get the initialized client right before making the API call.
    const client = getAiClient();

    const response = await client.models.generateImages({
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
        // Let the specific config error from getAiClient pass through.
        if (error.message.startsWith('Configuration Error')) {
            throw error;
        }
        throw new Error(`An unexpected error occurred: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the image.");
  }
};
