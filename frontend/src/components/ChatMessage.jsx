import React from 'react';

// This component displays a single chat message.
// It shows a different style for messages from the 'user' vs. the 'model' (AI).
const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`py-4 ${isUser ? '' : 'bg-gray-100 dark:bg-gray-900'}`}>
      <div className="max-w-4xl mx-auto px-4 flex items-start gap-4">
        {/* Simple avatar based on role */}
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white flex-shrink-0">
          {isUser ? 'U' : 'AI'}
        </div>
        <div className="prose dark:prose-invert max-w-none">
          {/* We'll need to properly render the JSON later */}
          <p>{message.text}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;