import React from 'react';
import Header from './components/Header';
import ImageGenerator from './components/ImageGenerator';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-gray-200 font-sans flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <ImageGenerator />
      </main>
      <Footer />
    </div>
  );
}

export default App;