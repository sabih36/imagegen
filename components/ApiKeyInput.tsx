import React, { useState } from 'react';

interface ApiKeyInputProps {
  onApiKeySubmit: (apiKey: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySubmit }) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) {
      setError('Please enter a valid API key.');
      return;
    }
    setError('');
    onApiKeySubmit(key.trim());
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-700 text-center">
      <h2 className="text-2xl font-bold text-white mb-4">Enter Your Gemini API Key</h2>
      <p className="text-gray-400 mb-6">
        To use the image generator, please provide your API key. Your key is used only for this session and is not stored.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Paste your API key here"
            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            aria-label="API Key Input"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 text-lg"
        >
          Start Generating
        </button>
      </form>
      {error && <p className="mt-4 text-red-400">{error}</p>}
      <p className="text-xs text-gray-500 mt-6">
        For the best experience, we recommend setting the API_KEY as a secret in your hosting platform.
      </p>
    </div>
  );
};

export default ApiKeyInput;
