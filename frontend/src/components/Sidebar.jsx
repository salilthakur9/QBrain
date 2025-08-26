import React, { useState, useEffect } from 'react';

const Sidebar = ({ isSidebarOpen, toggleSidebar, currentUser, userToken }) => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // This function runs whenever the userToken changes
    const fetchHistory = async () => {
      if (!userToken) {
        setHistory([]); // Clear history if user logs out
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8081/api/history', {
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch history');
        }
        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error("Error fetching history:", error);
        // Optionally, show an error message to the user
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [userToken]); // The dependency array ensures this runs when the token changes

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 bg-gray-800
        w-64 p-4 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        transition-transform duration-300 ease-in-out z-30
        flex flex-col
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

      {/* Conditional Content */}
      <div className="flex-grow overflow-y-auto">
        {currentUser ? (
          isLoading ? (
            <p className="text-gray-400">Loading history...</p>
          ) : history.length > 0 ? (
            <ul>
              {history.map((item) => (
                <li key={item.id} className="p-2 rounded hover:bg-gray-700 cursor-pointer truncate">
                  {/* We'll just show the first few words of the original text */}
                  {item.originalText.substring(0, 30)}...
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No history yet.</p>
          )
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