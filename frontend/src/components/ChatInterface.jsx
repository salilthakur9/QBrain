import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';

const ChatInterface = ({ userToken, onNewHistoryItem, selectedHistory }) => {
  // This state now correctly initializes for a new chat or loads from storage
  const [messages, setMessages] = useState(() => {
    // If we are viewing a history item, don't load from storage
    if (selectedHistory) return [];
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // This effect now correctly saves the active chat to localStorage
  useEffect(() => {
    // Only save to localStorage if we are NOT viewing a history item
    if (!selectedHistory) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages, selectedHistory]);

  // This effect handles displaying a selected history item
  useEffect(() => {
    if (selectedHistory && selectedHistory.originalText) {
      const userMessage = { role: 'user', text: selectedHistory.originalText };
      const aiMessage = { role: 'model', text: selectedHistory.generatedMcqs };
      setMessages([userMessage, aiMessage]);
    }
    // When selectedHistory becomes null (e.g. on New Chat), this component will
    // re-mount because of the key prop, correctly re-initializing the state.
  }, [selectedHistory]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage = { role: 'user', text: inputText };

    // If we were viewing history, a new message starts a new chat
    const newMessages = selectedHistory ? [userMessage] : [...messages, userMessage];
    setMessages(newMessages);

    const currentInput = inputText;
    setInputText('');
    setIsLoading(true);

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (userToken) {
        headers['Authorization'] = `Bearer ${userToken}`;
      }
      const response = await fetch('http://localhost:8081/api/generate/mcq', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ text: currentInput }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      const aiText = data.candidates[0].content.parts[0].text;
      const aiMessage = { role: 'model', text: aiText };

      setMessages(prev => [...prev, aiMessage]);

      if (userToken) {
        onNewHistoryItem();
      }
    } catch (error) {
      console.error('Error fetching MCQs:', error);
      const errorMessage = { role: 'model', text: 'Sorry, I ran into an error. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center mt-20">
            <h1 className="text-4xl md-text-5xl font-bold mb-4">MCQ Generator</h1>
            <p className="text-lg text-gray-400">Provide text or upload a PDF to get started.</p>
          </div>
        ) : (
          <div>
            {messages.map((msg, index) => (<ChatMessage key={index} message={msg} />))}
            {isLoading && (
              <div className="max-w-4xl mx-auto px-4 flex items-center gap-4 py-4">
                 <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center font-bold text-white flex-shrink-0">AI</div>
                 <p>Generating...</p>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>
      <div className="w-full max-w-4xl mx-auto p-4">
        <form onSubmit={handleSendMessage} className="relative">
          <textarea
            className="w-full p-4 pr-28 rounded-full bg-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
            placeholder="Enter your text here..."
            rows="1"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { handleSendMessage(e); } }}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button type="button" className="p-2 rounded-full hover:bg-gray-700" title="Upload PDF (coming soon)">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </button>
            <button type="submit" disabled={isLoading} className="p-3 rounded-full bg-sky-500 text-white hover:bg-sky-600 disabled:bg-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ChatInterface;