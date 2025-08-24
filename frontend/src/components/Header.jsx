import React from 'react';

const Header = () => {
  return (
    <header className="bg-gray-200 dark:bg-gray-800 p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">MCQ Generator</h1>
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Login
      </button>
    </header>
  );
};

export default Header;