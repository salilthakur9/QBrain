import React from 'react';

// We receive a new 'toggleSidebar' function as a prop
const Header = ({ toggleSidebar }) => {
  return (
    <header className="bg-gray-200 dark:bg-gray-800 p-4 flex justify-between items-center shadow-md z-20">
      <div className="flex items-center gap-4">
        {/* Hamburger Menu Icon */}
        <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">MCQ Generator</h1>
      </div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Login
      </button>
    </header>
  );
};

export default Header;