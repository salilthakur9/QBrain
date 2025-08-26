import React from 'react';

// We now receive 'toggleSidebar' as a prop
const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <aside
      className={`
        fixed inset-y-0 left-0
        bg-black
        w-64 p-4
        transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        transition-transform duration-300 ease-in-out
        z-30
      `}
    >
      {/* Sidebar Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">History</h2>
        {/* Close Button */}
        <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="text-center mt-10">
        <p className="text-sm text-gray-500">Login to see your history.</p>
      </div>
    </aside>
  );
};

export default Sidebar;