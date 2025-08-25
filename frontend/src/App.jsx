import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import Footer from './components/Footer';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    // Check for saved theme, otherwise check system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // This effect applies the theme class to the ROOT <html> element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    // The classes here now correctly react to the global dark class
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <Header
        toggleSidebar={toggleSidebar}
        theme={theme}
        toggleTheme={toggleTheme}
      />
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