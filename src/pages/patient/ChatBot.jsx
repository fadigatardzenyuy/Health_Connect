import React, { useState, useCallback } from "react";

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "How can I assist you today?", sender: "assistant" },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = useCallback(() => {
    if (inputMessage.trim()) {
      const newUserMessage = {
        id: Date.now(),
        text: inputMessage,
        sender: "user",
      };

      const updatedMessages = [...messages, newUserMessage];
      setMessages(updatedMessages);
      setInputMessage("");

      // Simulate assistant response
      setTimeout(() => {
        const assistantResponse = {
          id: Date.now() + 1,
          text: "I received your message!",
          sender: "assistant",
        };
        setMessages((prev) => [...prev, assistantResponse]);
      }, 1000);
    }
  }, [inputMessage, messages]);

  return (
    <div className="p-4 max-w-2xl mx-auto" aria-label="Chat Interface">
      <h2 className="text-xl font-bold mb-4">Chat with Assistant</h2>

      <div
        className="border rounded-lg p-4 h-96 overflow-y-auto mb-4"
        role="log"
        aria-live="polite"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 p-2 rounded ${
              msg.sender === "assistant"
                ? "bg-gray-100 text-gray-800 text-left"
                : "bg-blue-100 text-blue-800 text-right"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type your message..."
          className="flex-grow p-2 border rounded-l-lg"
          aria-label="Message input"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white p-2 rounded-r-lg"
          aria-label="Send message"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
