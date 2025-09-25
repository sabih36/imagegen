import { GoogleGenAI } from "@google/genai";

// We will initialize the client lazily to avoid a crash on startup if the environment is not configured.
let ai: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  // Safely check for the API key in the environment variables.
  const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;

  if (!apiKey) {
    console.error("API_KEY environment variable not set.");
    throw new Error("Configuration Error: The API key is missing. Please ensure it is set up correctly in your environment configuration.");
  }
  
  if (!ai) {
    ai = new GoogleGenAI({ apiKey });
  }
  
  return ai;
}

export const generateDescription = async (prompt: string): Promise<string> => {
  try {
    const aiClient = getAiClient();
    const fullPrompt = `Describe a photorealistic image of the following scene in vivid detail. Focus on colors, lighting, composition, and mood: "${prompt}"`;
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating description:", error);
    if (error instanceof Error) {
        // Provide a more user-friendly message for common API errors
        if (error.message.includes('API key not valid')) {
            throw new Error('Authentication Error: The provided API key is not valid. Please check your environment configuration.');
        }
        if (error.message.includes('billed users')) {
            throw new Error('Account Issue: This feature may require a billing-enabled Google Cloud project. Please enable billing for your project and try again.');
        }
         // Forward the configuration error from getAiClient
        if (error.message.startsWith('Configuration Error:')) {
            throw error;
        }
        throw new Error(`Failed to generate description: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the description.");
  }
};