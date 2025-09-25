import React, { useState } from 'react';
import Header from './components/Header';
import ImageGenerator from './components/ImageGenerator';
import Footer from './components/Footer';
import ApiKeyInput from './components/ApiKeyInput';

function App() {
  // Try to get API key from environment variables first as the preferred method.
  const [apiKey, setApiKey] = useState<string | null>(process.env.API_KEY || null);

  const handleApiKeySubmit = (key: string) => {
    if (key) {
      setApiKey(key);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-gray-200 font-sans flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        {apiKey ? (
          <ImageGenerator apiKey={apiKey} />
        ) : (
          <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
