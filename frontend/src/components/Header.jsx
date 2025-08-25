import React from 'react';
// Import icons for the theme toggle
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

// We now receive theme and toggleTheme as props
const Header = ({ toggleSidebar, theme, toggleTheme }) => {
  return (
    <header className="bg-gray-200 dark:bg-gray-800 p-4 flex justify-between items-center shadow-md z-20">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">MCQ Generator</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* THEME TOGGLE BUTTON */}
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700">
          {theme === 'dark' ? (
            <SunIcon className="h-6 w-6 text-yellow-500" />
          ) : (
            <MoonIcon className="h-6 w-6 text-gray-700" />
          )}
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Login
        </button>
      </div>
    </header>
  );
};

export default Header;