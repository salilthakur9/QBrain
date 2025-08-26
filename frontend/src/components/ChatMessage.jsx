import React from 'react';

// This is a helper component to render the parsed questions nicely
const McqDisplay = ({ questions }) => {
  // Check if questions is actually an array before trying to map
  if (!Array.isArray(questions)) {
    return <p>Error: Invalid question format.</p>;
  }
  return (
    <div className="space-y-6">
      {questions.map((q, index) => (
        <div key={index} className="p-4 bg-gray-700 rounded-lg">
          <p className="font-semibold mb-2">{index + 1}. {q.question}</p>
          <ul className="space-y-1 list-inside">
            {/* Ensure options is an array before mapping */}
            {Array.isArray(q.options) && q.options.map((option, i) => (
              <li key={i} className={`${option === q.answer ? 'text-green-400 font-bold' : ''}`}>
                - {option}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  let content;
  let isMcqArray = false;

  // --- THIS IS THE CORRECTED PARSING LOGIC ---
  if (message.role === 'model') {
    try {
      // Step 1: Clean the text by removing markdown code fences
      const cleanedText = message.text.replace(/```json\n?|```/g, '').trim();

      // Step 2: Try to parse the cleaned text
      const parsedData = JSON.parse(cleanedText);

      // Step 3: Check if the result is a valid array
      if (Array.isArray(parsedData)) {
        content = parsedData;
        isMcqArray = true;
      } else {
        // If it's valid JSON but not an array, just show the original text
        content = message.text;
      }
    } catch (error) {
      // If parsing fails, it's just plain text
      content = message.text;
      isMcqArray = false;
    }
  } else {
    // User messages are always plain text
    content = message.text;
  }
  // --- END OF FIX ---

  return (
    <div className={`py-6 ${isUser ? '' : 'bg-gray-800'}`}>
      <div className="max-w-4xl mx-auto px-4 flex items-start gap-4">
        <div className={`w-8 h-8 rounded-full ${isUser ? 'bg-gray-600' : 'bg-sky-500'} flex items-center justify-center font-bold text-white flex-shrink-0`}>
          {isUser ? 'U' : 'AI'}
        </div>
        <div className="prose prose-invert max-w-none pt-1">
          {isMcqArray ? <McqDisplay questions={content} /> : <p>{content}</p>}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
