import { GoogleGenAI } from "@google/genai";

export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

// The generateImage function now accepts the apiKey as a parameter.
export const generateImage = async (prompt: string, aspectRatio: AspectRatio, apiKey: string): Promise<string> => {
  // A quick check to ensure the key is not empty.
  if (!apiKey) {
      throw new Error('Configuration Error: The API key is missing. Please provide the key to continue.');
  }

  // The client is initialized here, using the provided key.
  const ai = new GoogleGenAI({ apiKey });

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
            throw new Error('Authentication Error: The API key is not valid. Please check your key and try again.');
        }
        if (error.message.includes('billing')) {
             throw new Error('Account Issue: This feature requires a billing-enabled Google Cloud project. Please enable billing and try again.');
        }
        throw new Error(`An unexpected error occurred: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the image.");
  }
};
