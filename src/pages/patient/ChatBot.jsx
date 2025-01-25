"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AlertCircle, Send, Download, Mic, ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { TypingIndicator } from "../../components/TypingIndicator";
import { SymptomSelector } from "../../components/SymptomSelector";

// Simulated AI response generator
const generateAIResponse = async (userMessage) => {
  await new Promise((resolve) =>
    setTimeout(resolve, 1000 + Math.random() * 2000)
  ); // Simulate network delay
  const responses = [
    "I understand your concern. It would be best to consult with a doctor for a proper diagnosis.",
    "Your symptoms could be related to several conditions. Monitor them and seek medical attention if they persist.",
    "Have you noticed any other symptoms or changes in your condition recently?",
    "I recommend keeping a log of your symptoms, including when they occur and their severity.",
    "Only a qualified healthcare professional can give you a proper diagnosis and treatment plan.",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

export default function Chatbot() {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      id: "1",
      type: "assistant",
      content:
        "Hello! I'm your AI medical assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newUserMessage = {
        id: Date.now().toString(),
        type: "user",
        content: message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newUserMessage]);
      setMessage("");
      setIsTyping(true);

      try {
        const aiResponse = await generateAIResponse(message);
        const newAIMessage = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: aiResponse,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newAIMessage]);
      } catch (error) {
        console.error("Error generating AI response:", error);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleSymptomSelect = (symptom) => {
    setMessage((prev) => `${prev}${prev ? ", " : ""}${symptom.name}`);
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    // Implement voice recording logic here
  };

  const handleImageUpload = () => {
    // Implement image upload logic here
  };

  const exportSummary = () => {
    const summary = messages
      .map(
        (msg) =>
          `${format(msg.timestamp, "yyyy-MM-dd HH:mm")} - ${msg.type}: ${
            msg.content
          }`
      )
      .join("\n\n");

    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "consultation-summary.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ height: "100vh" }}>
      <header className="bg-blue-600 text-white fixed w-full z-10 flex justify-between items-center h-16 p-4">
        <h1 className="text-xl font-bold">Hospital AI Consultation</h1>
        <select className="bg-blue-700 text-white px-4 py-2 rounded-md">
          <option>English</option>
          <option>Español</option>
          <option>Français</option>
          <option>Deutsch</option>
        </select>
      </header>

      <main className="flex-1 container mx-auto p-4 max-w-4xl pt-16 flex flex-col">
        <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>
            This is an AI assistant for informational purposes only. For medical
            emergencies, please call emergency services immediately. Always
            consult with qualified healthcare professionals for medical advice.
          </span>
        </div>

        <div className="bg-white rounded-lg shadow-md mb-4 flex-1 flex flex-col">
          <h2 className="text-lg font-semibold p-4">Medical Consultation</h2>
          <div className="max-h-[400px] overflow-y-auto p-4 flex-1">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.type === "assistant" ? "items-start" : "items-end"
                  }`}
                >
                  <div
                    className={`p-4 rounded-lg max-w-[80%] ${
                      msg.type === "assistant"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-gray-100"
                    }`}
                  >
                    {msg.content}
                    <div className="text-xs text-gray-500 mt-1">
                      {format(msg.timestamp, "HH:mm")}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={exportSummary}
            className="w-full md:w-auto border border-gray-300 rounded-md px-4 py-2 text-gray-700 flex items-center"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Summary
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SymptomSelector onSelect={handleSymptomSelect} />
            <div className="flex gap-2">
              <button
                onClick={handleVoiceRecord}
                className={`flex-1 border border-gray-300 rounded-md px-4 py-2 flex items-center ${
                  isRecording ? "bg-red-50 text-red-600" : ""
                }`}
              >
                <Mic className="mr-2 h-4 w-4" />
                {isRecording ? "Recording..." : "Voice Input"}
              </button>
              <button
                onClick={handleImageUpload}
                className="flex-1 border border-gray-300 rounded-md px-4 py-2 flex items-center"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Upload Image
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your symptoms in detail..."
              className="min-h-[100px] border border-gray-300 rounded-md p-2"
            />
            <button
              type="submit"
              className="ml-auto border border-gray-300 rounded-md px-4 py-2 flex items-center"
            >
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
