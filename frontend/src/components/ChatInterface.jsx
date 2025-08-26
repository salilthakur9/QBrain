import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage = { role: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8081/api/generate/mcq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      const aiText = data.candidates[0].content.parts[0].text;
      const aiMessage = { role: 'model', text: aiText };
      setMessages(prev => [...prev, aiMessage]);
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Apna Laptop dekh 😞</h1>
            <p className="text-lg text-gray-400">Description likh dena bhai 😭</p>
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
            {/* Updated send button to sky blue */}
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