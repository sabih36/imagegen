import React, { useState, useCallback } from 'react';
import type { AspectRatio } from '../services/geminiService';
import Spinner from './Spinner';

const aspectRatios: { label: string; value: AspectRatio }[] = [
  { label: 'Square', value: '1:1' },
  { label: 'Widescreen', value: '16:9' },
  { label: 'Portrait', value: '9:16' },
];

interface ImageGeneratorProps {
  apiKey: string;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ apiKey }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  const handleGenerateClick = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      // Dynamically import the service only when needed.
      const { generateImage } = await import('../services/geminiService');
      const imageBytes = await generateImage(prompt, aspectRatio, apiKey);
      const imageUrl = `data:image/png;base64,${imageBytes}`;
      setGeneratedImageUrl(imageUrl);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [prompt, aspectRatio, apiKey]);
  
  const handleDownloadClick = () => {
    if (!generatedImageUrl) return;
    const link = document.createElement('a');
    link.href = generatedImageUrl;
    link.download = `${prompt.slice(0, 20).replace(/\s+/g, '_') || 'generated_image'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side: Controls */}
        <div className="flex flex-col space-y-6">
          <div>
            <label htmlFor="prompt" className="block text-lg font-medium text-gray-300 mb-2">
              Describe the image you want to create
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
            <label className="block text-lg font-medium text-gray-300 mb-2">
              Aspect Ratio
            </label>
            <div className="grid grid-cols-3 gap-2">
              {aspectRatios.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setAspectRatio(value)}
                  disabled={isLoading}
                  className={`py-2 px-3 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                    aspectRatio === value
                      ? 'bg-indigo-600 text-white ring-2 ring-offset-2 ring-offset-gray-800 ring-indigo-500'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {label}
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
        <div className="flex flex-col items-center justify-start space-y-4">
            <div className="w-full flex items-center justify-center bg-gray-900 rounded-lg border-2 border-dashed border-gray-700 aspect-square p-2">
              {isLoading && (
                  <div className="flex flex-col items-center text-gray-400">
                    <Spinner />
                    <p className="mt-4 animate-pulse">Weaving pixels...</p>
                  </div>
              )}
              {!isLoading && !generatedImageUrl && (
                  <div className="text-center text-gray-500 p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-lg font-semibold">Your masterpiece awaits</h3>
                    <p className="text-sm">Enter a prompt and click "Generate" to see the magic.</p>
                  </div>
              )}
              {generatedImageUrl && !isLoading && (
                  <img src={generatedImageUrl} alt={prompt} className="w-full h-full object-contain rounded-md animate-fade-in" />
              )}
            </div>
            {generatedImageUrl && !isLoading && (
                <button
                    onClick={handleDownloadClick}
                    className="w-full bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors duration-200 flex items-center justify-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Image
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
