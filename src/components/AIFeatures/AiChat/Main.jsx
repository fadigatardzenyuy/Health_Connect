
// import { Button } from "../../ui/button";
import React, { useState, useRef, useEffect } from 'react';
import {
    Send,
    Paperclip,
    Mic,
    FileText,
    Image,
    UserPlus,
    HeartPulse,
    ShieldCheck,
    Activity,
    X,
    Stethoscope,
    Award,
    Zap
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AIPersonaHeader from "./Persona";
import SuggestionCategories from "./Suggestions";
import ChatMessages from "./ChatMessage";
import ChatInputArea from "./InputArea";



const AiDocInterface = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'welcome',
            content: "Welcome to AiDoc, your intelligent medical companion. I'm here to provide comprehensive, personalized health insights.",
            sender: 'ai'
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [selectedPrompt, setSelectedPrompt] = useState(null);

    const handleSendMessage = () => {
        const messageToSend = selectedPrompt || inputMessage;

        if (messageToSend.trim() === '') return;

        const userMessage = {
            id: messages.length + 1,
            content: messageToSend,
            sender: 'user'
        };

        const aiResponse = {
            id: messages.length + 2,
            content: `I'm comprehensively analyzing your query about: "${messageToSend}". Generating precise, evidence-based insights...`,
            sender: 'ai'
        };

        setMessages(prev => [...prev, userMessage, aiResponse]);
        setInputMessage('');
        setSelectedPrompt(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex flex-col">
            <AIPersonaHeader />
            <div className="flex flex-col md:flex-row flex-grow">
                <div className="w-full md:w-1/3 border-r border-emerald-100">
                    <SuggestionCategories
                        onPromptSelect={setSelectedPrompt}
                        selectedPrompt={selectedPrompt}
                    />
                </div>
                <div className="w-full md:w-2/3 flex flex-col">
                    <ChatMessages messages={messages} />
                    <ChatInputArea
                        inputMessage={inputMessage}
                        selectedPrompt={selectedPrompt}
                        onInputChange={setInputMessage}
                        onSendMessage={handleSendMessage}
                    />
                </div>
            </div>
        </div>
    );
};

export default AiDocInterface;