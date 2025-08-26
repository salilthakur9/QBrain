import React, { useState, useEffect } from 'react';

// Receive onHistorySelect and onNewChat props
const Sidebar = ({ isSidebarOpen, toggleSidebar, user, historyKey, onHistorySelect, onNewChat }) => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.token) {
        setHistory([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8081/api/history', {
          headers: { 'Authorization': `Bearer ${user.token}` },
          cache: 'no-cache',
        });
        if (!response.ok) throw new Error('Failed to fetch history');
        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [user, historyKey]);

  const handleNewChatClick = () => {
    // Clear the main chat window
    onNewChat();
    // Close sidebar on mobile for better UX
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 bg-gray-800
        w-64 p-4 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        transition-transform duration-300 ease-in-out z-30
        flex flex-col border-r border-gray-700
      `}
    >
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="font-bold text-lg">History</h2>
        <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* --- NEW: New Chat Button --- */}
      <button
        onClick={handleNewChatClick}
        className="w-full mb-4 p-2 rounded bg-sky-500 text-white font-semibold hover:bg-sky-600 flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        New Chat
      </button>

      <div className="flex-grow overflow-y-auto">
        {user ? (
          isLoading ? ( <p className="text-gray-400">Loading...</p> )
          : history.length > 0 ? (
            <ul className="space-y-2">
              {history.map((item) => (
                // --- NEW: onClick handler added ---
                <li key={item.id} onClick={() => onHistorySelect(item)} className="p-2 rounded text-sm hover:bg-gray-700 cursor-pointer truncate">
                  {item.originalText.substring(0, 35)}...
                </li>
              ))}
            </ul>
          ) : ( <p className="text-gray-400 text-center mt-4">No history yet.</p> )
        ) : (
          <div className="text-center mt-10">
            <p className="text-sm text-gray-500">Login to see your history.</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;