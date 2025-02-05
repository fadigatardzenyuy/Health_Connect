// import React from "react"
// import { useEffect, useRef } from "react";
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
// Chat Messages Component
const ChatMessages = ({ messages }) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-emerald-50/50 to-teal-50/50">
            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} transition-all duration-300`}
                >
                    {msg.type === 'welcome' ? (
                        <div className="bg-emerald-100/80 backdrop-blur-sm text-emerald-900 p-4 rounded-2xl max-w-[80%] shadow-md animate-fade-in">
                            {msg.content}
                        </div>
                    ) : (
                        <div className={`
              p-4 rounded-2xl max-w-[80%] 
              ${msg.sender === 'user'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white text-gray-800 border border-emerald-100'}
              shadow-md transition-all duration-300 hover:scale-[1.02]
            `}>
                            {msg.content}
                        </div>
                    )}
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatMessages