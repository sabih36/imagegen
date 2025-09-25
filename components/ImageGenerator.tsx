import React, { useState, useCallback } from 'react';
import { generateDescription } from '../services/geminiService';
import Spinner from './Spinner';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedDescription, setGeneratedDescription] = useState<string | null>(null);

  const handleGenerateClick = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedDescription(null);

    try {
      const description = await generateDescription(prompt);
      setGeneratedDescription(description);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

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
              'Generate Description'
            )}
          </button>
          
          {error && <div role="alert" className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">{error}</div>}
        </div>

        {/* Right side: Description Display */}
        <div className="flex flex-col items-center justify-start">
            <div className="w-full flex items-center justify-center bg-gray-900 rounded-lg border-2 border-dashed border-gray-700 aspect-square p-2">
            {isLoading && (
                <div className="flex flex-col items-center text-gray-400">
                <Spinner />
                <p className="mt-4 animate-pulse">Generating description...</p>
                </div>
            )}
            {!isLoading && !generatedDescription && (
                <div className="text-center text-gray-500 p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <h3 className="text-lg font-semibold">Your masterpiece awaits description</h3>
                <p className="text-sm">Enter a prompt and click "Generate" to see the magic happen.</p>
                </div>
            )}
            {generatedDescription && !isLoading && (
                <div className="w-full h-full p-4 overflow-y-auto text-gray-300 animate-fade-in text-left whitespace-pre-wrap">
                  {generatedDescription}
                </div>
            )}
            </div>
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