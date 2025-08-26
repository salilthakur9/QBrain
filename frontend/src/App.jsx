import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Import the decoder
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // State for user info {name, email}

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // Check if token is expired
        if (decodedToken.exp * 1000 > Date.now()) {
          setUserToken(token);
          setCurrentUser({ name: decodedToken.name, email: decodedToken.sub });
        } else {
          // Token is expired, remove it
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('authToken');
      }
    }
  }, []);

  const handleLoginSuccess = (token) => {
    const decodedToken = jwtDecode(token);
    localStorage.setItem('authToken', token);
    setUserToken(token);
    setCurrentUser({ name: decodedToken.name, email: decodedToken.sub });
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUserToken(null);
    setCurrentUser(null);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dark flex flex-col h-screen bg-gray-900 text-white">
      <Header
        toggleSidebar={toggleSidebar}
        currentUser={currentUser} // Pass the whole user object
        openAuthModal={() => setAuthModalOpen(true)}
        handleLogout={handleLogout}
      />
      {/* ... rest of the JSX is the same */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        <div className="flex flex-col flex-1">
          <ChatInterface />
          <Footer />
        </div>
      </div>
      {isAuthModalOpen && !currentUser && (
        <AuthModal
          closeModal={() => setAuthModalOpen(false)}
          handleLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

export default App;