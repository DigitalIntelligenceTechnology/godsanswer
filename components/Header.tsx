
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm text-center p-4 shadow-lg shadow-yellow-400/10 fixed top-0 left-0 right-0 z-10">
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-yellow-300 tracking-wider" style={{ textShadow: '0 0 8px rgba(253, 224, 71, 0.7)' }}>
        GOD'S ANSWER
      </h1>
    </header>
  );
};

export default Header;
