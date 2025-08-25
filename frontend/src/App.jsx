import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import Footer from './components/Footer';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // All theme logic (useState, useEffect, toggleTheme) has been removed.
  // We add the "dark" class directly here to make the theme permanent.
  return (
    <div className="dark flex flex-col h-screen bg-black text-white">
      <Header toggleSidebar={toggleSidebar} />
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
    </div>
  );
}

export default App;