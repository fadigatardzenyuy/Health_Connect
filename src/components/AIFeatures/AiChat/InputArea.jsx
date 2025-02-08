// import { Send } from "lucide-react";
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

// Input Area Component
const ChatInputArea = ({
    inputMessage,
    selectedPrompt,
    onInputChange,
    onSendMessage
}) => {
    return (
        <div className="p-4 bg-white/80 backdrop-blur-md border-t border-emerald-100 shadow-2xl">
            <div className="flex space-x-2 items-center">
                <div className="flex space-x-1">
                    {[Paperclip, Image, Mic].map((Icon, index) => (
                        <Button
                            key={index}
                            variant="ghost"
                            size="icon"
                            className="text-emerald-600 hover:bg-emerald-100"
                        >
                            <Icon className="w-5 h-5" />
                        </Button>
                    ))}
                </div>
                <div className="flex-grow">
                    <Input
                        value={selectedPrompt || inputMessage}
                        onChange={(e) => onInputChange(e.target.value)}
                        placeholder="Ask a comprehensive health question..."
                        className="w-full border-emerald-200 focus:border-emerald-500 focus:ring-emerald-300"
                        onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
                    />
                </div>
                <Button
                    onClick={onSendMessage}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white transition-transform active:scale-95"
                    disabled={!selectedPrompt && inputMessage.trim() === ''}
                >
                    <Send className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
};

export default ChatInputArea