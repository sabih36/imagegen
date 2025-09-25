import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-4 px-4 sm:px-8 text-center text-gray-500 text-sm">
      <p>&copy; {new Date().getFullYear()} AI Image Weaver. All rights reserved.</p>
    </footer>
  );
};

export default Footer;