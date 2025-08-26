import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [historyKey, setHistoryKey] = useState(0);
  const [selectedHistory, setSelectedHistory] = useState(null);
  // --- NEW --- State to explicitly trigger a new chat
  const [chatKey, setChatKey] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser({ token: token, name: decoded.name, email: decoded.sub });
        } else {
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('authToken');
      }
    }
  }, []);

  const handleLoginSuccess = (token) => {
    const decoded = jwtDecode(token);
    localStorage.setItem('authToken', token);
    setUser({ token: token, name: decoded.name, email: decoded.sub });
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('chatMessages'); // Also clear chat on logout
    setUser(null);
    setSelectedHistory(null);
    setChatKey(prev => prev + 1); // Trigger a new chat on logout
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const triggerHistoryRefresh = () => {
    setHistoryKey(prevKey => prevKey + 1);
  };

  const handleHistorySelect = (historyItem) => {
    setSelectedHistory(historyItem);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  // --- FIX --- "New Chat" now simply increments the chatKey
  const handleNewChat = () => {
    setSelectedHistory(null);
    setChatKey(prev => prev + 1);
  };


  return (
    <div className="dark flex flex-col h-screen bg-gray-900 text-white">
      <Header
        toggleSidebar={toggleSidebar}
        user={user}
        openAuthModal={() => setAuthModalOpen(true)}
        handleLogout={handleLogout}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          user={user}
          historyKey={historyKey}
          onHistorySelect={handleHistorySelect}
          onNewChat={handleNewChat}
        />
        <div className="flex flex-col flex-1">
          <ChatInterface
            key={chatKey} // Pass the key here
            userToken={user?.token}
            onNewHistoryItem={triggerHistoryRefresh}
            selectedHistory={selectedHistory}
          />
          <Footer />
        </div>
      </div>
      {isAuthModalOpen && !user && (
        <AuthModal
          closeModal={() => setAuthModalOpen(false)}
          handleLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

export default App;