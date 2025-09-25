import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  // This is a safeguard to warn developers if the environment is not set up.
  console.warn("API_KEY environment variable not set. Image generation will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

export const generateImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
  // Provide a clear, user-facing error if the API key is missing during an actual generation attempt.
  if (!process.env.API_KEY) {
    throw new Error("Configuration Error: The API key is not configured. Please contact the site administrator.");
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
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the image.");
  }
};
