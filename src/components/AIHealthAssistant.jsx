import React, { useState } from 'react';
// import { Button } from "@/components/ui/button";
import { Bot, X } from 'lucide-react';
import { Button } from './ui/button';
// import { Button } from './ui/button';

const AIHealthAssistant = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 z-50 animate-fade-in">
            <div className="relative bg-white rounded-lg shadow-lg border border-emerald-100 p-4 max-w-[300px]">
                <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-emerald-50"
                    onClick={() => setIsVisible(false)}
                >
                    <X className="h-4 w-4 text-emerald-600" />
                </Button>

                <div className="flex items-start space-x-3">
                    <div className="bg-emerald-100 p-2 rounded-full">
                        <Bot className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex-1 pt-1">
                        <p className="text-sm text-gray-600 mb-3">
                            Would you like to continue with our AI Health Assistant for personalized support?
                        </p>
                        <div className="flex space-x-2">
                            <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={() => {
                                    // Handle AI chat initiation
                                    console.log('Starting AI chat');
                                }}
                            >
                                Chat with AI
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                                onClick={() => setIsVisible(false)}
                            >
                                Maybe Later
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIHealthAssistant;