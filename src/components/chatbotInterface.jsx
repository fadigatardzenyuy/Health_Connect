import React, { useState } from "react";

export default function Chat({ language }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = simulateAIResponse(input, language);
        setMessages((prev) => [...prev, { text: aiResponse, sender: "ai" }]);
      }, 1000);
    }
  };

  const texts = {
    en: {
      placeholder: "Describe your symptoms...",
      send: "Send",
      disclaimer:
        "This is an AI-powered consultation. For emergencies, please call 911.",
    },
    es: {
      placeholder: "Describe tus síntomas...",
      send: "Enviar",
      disclaimer:
        "Esta es una consulta impulsada por IA. Para emergencias, llame al 911.",
    },
  };

  const t = texts[language];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="h-96 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block p-2 rounded-lg ${
                message.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {message.text}
            </span>
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <p className="text-sm text-gray-500 mb-2">{t.disclaimer}</p>
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.placeholder}
            className="flex-grow p-2 border border-gray-300 rounded-l-lg"
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white p-2 rounded-r-lg"
          >
            {t.send}
          </button>
        </div>
      </div>
    </div>
  );
}

function simulateAIResponse(input, language) {
  const responses = {
    en: [
      "I understand you're experiencing symptoms. Can you tell me more?",
      "Based on what you've described, it could be a few things. Let's narrow it down with a few more questions.",
      "I recommend you consult with a doctor for a proper diagnosis.",
    ],
    es: [
      "Entiendo que está experimentando síntomas. ¿Puede decirme más sobre cuándo comenzaron?",
      "Basado en lo que ha descrito, podría ser varias cosas. Vamos a reducirlo con algunas preguntas más.",
      "Le recomiendo que consulte con un médico para un diagnóstico adecuado.",
    ],
  };

  const languageResponses = responses[language];
  return languageResponses[
    Math.floor(Math.random() * languageResponses.length)
  ];
}
