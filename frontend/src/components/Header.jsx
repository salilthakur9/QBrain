import React from 'react';

const Header = ({ toggleSidebar, user, openAuthModal, handleLogout }) => {
  return (
    <header className="bg-gray-800 p-4 flex justify-between items-center shadow-md z-20">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">MCQ Generator</h1>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center font-bold">
                {user.name.charAt(0)}
              </div>
              <span className="font-semibold hidden sm:block">{user.name}</span>
            </div>
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded font-semibold hover:bg-red-600">
              Logout
            </button>
          </>
        ) : (
          <button onClick={openAuthModal} className="bg-sky-500 text-white px-4 py-2 rounded font-semibold hover:bg-sky-600">
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;