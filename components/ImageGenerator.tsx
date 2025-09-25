import React, { useState, useCallback } from 'react';
import { generateImage, AspectRatio } from '../services/geminiService';
import Spinner from './Spinner';

const aspectRatios: { label: string; value: AspectRatio }[] = [
  { label: 'Square', value: '1:1' },
  { label: 'Landscape', value: '16:9' },
  { label: 'Portrait', value: '9:16' },
  { label: 'Wide', value: '4:3' },
  { label: 'Tall', value: '3:4' },
];

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerateClick = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageUrl = await generateImage(prompt, aspectRatio);
      setGeneratedImage(imageUrl);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [prompt, aspectRatio]);

  const handleDownloadClick = useCallback(() => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    
    // Sanitize the prompt to create a safe and descriptive filename
    const sanitizedPrompt = prompt
      .trim()
      .slice(0, 50)
      .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, '_'); // Replace spaces with underscores
      
    const filename = sanitizedPrompt ? `${sanitizedPrompt}.jpeg` : 'ai-generated-image.jpeg';

    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedImage, prompt]);

  return (
    <div className="w-full max-w-5xl mx-auto bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side: Controls */}
        <div className="flex flex-col space-y-6">
          <div>
            <label htmlFor="prompt" className="block text-lg font-medium text-gray-300 mb-2">
              Describe your vision
            </label>
            <textarea
              id="prompt"
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A majestic lion wearing a crown, cinematic lighting"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-none"
              disabled={isLoading}
              aria-label="Image prompt"
            />
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-300 mb-3">Aspect Ratio</h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {aspectRatios.map((ar) => (
                <button
                  key={ar.value}
                  onClick={() => setAspectRatio(ar.value)}
                  disabled={isLoading}
                  aria-pressed={aspectRatio === ar.value}
                  className={`px-3 py-2 text-sm rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 ${
                    aspectRatio === ar.value
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {ar.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerateClick}
            disabled={isLoading || !prompt.trim()}
            className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center text-lg"
          >
            {isLoading ? (
              <>
                <Spinner />
                <span className="ml-2">Generating...</span>
              </>
            ) : (
              'Generate Image'
            )}
          </button>
          
          {error && <div role="alert" className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">{error}</div>}
        </div>

        {/* Right side: Image Display */}
        <div className="flex flex-col items-center justify-start">
            <div className="w-full flex items-center justify-center bg-gray-900 rounded-lg border-2 border-dashed border-gray-700 aspect-square p-2">
            {isLoading && (
                <div className="flex flex-col items-center text-gray-400">
                <Spinner />
                <p className="mt-4 animate-pulse">Conjuring your image...</p>
                </div>
            )}
            {!isLoading && !generatedImage && (
                <div className="text-center text-gray-500 p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-semibold">Your masterpiece awaits</h3>
                <p className="text-sm">Enter a prompt and click "Generate" to see the magic happen.</p>
                </div>
            )}
            {generatedImage && !isLoading && (
                <img 
                src={generatedImage} 
                alt={prompt} 
                className="w-full h-full object-contain rounded-lg animate-fade-in"
                style={{ animation: 'fadeIn 0.5s ease-in-out' }}
                />
            )}
            </div>
            {generatedImage && !isLoading && (
                 <button
                    onClick={handleDownloadClick}
                    className="mt-4 w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center text-lg"
                    aria-label="Download generated image"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Download Image</span>
                </button>
            )}
        </div>

      </div>
       <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ImageGenerator;