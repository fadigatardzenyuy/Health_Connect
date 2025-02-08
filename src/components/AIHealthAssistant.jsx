import React, { useState } from "react";
import { Bot, X, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const AIHealthAssistant = () => {
    const [assistantState, setAssistantState] = useState({
        isVisible: true,
        avatarActive: false,
        role: null
    });


    /**
 * STILL DELIBERATING ON THIS FUNCTIONALITY. ABDUL CHECK SENSE ON IT
 
 */


    const handleConsult = (role) => {
        setAssistantState(prev => ({
            ...prev,
            avatarActive: true,
            role: role,
            isVisible: false
        }));
    };

    const handleAvatarClick = () => {
        console.log(`Navigating to ${assistantState.role} chat`);
        // Actual navigation logic would go here
    };

    if (!assistantState.isVisible && !assistantState.avatarActive) return null;

    return (
        <>
            {!assistantState.avatarActive && (
                <div className="fixed bottom-4 left-4 z-50 animate-fade-in">
                    <div className="relative bg-white rounded-lg shadow-lg border border-emerald-100 p-4 max-w-[300px]">
                        <button
                            className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-emerald-50 rounded"
                            onClick={() => setAssistantState(prev => ({ ...prev, isVisible: false }))}
                        >
                            <X className="h-4 w-4 text-emerald-600" />
                        </button>

                        <div className="flex items-start space-x-3">
                            <div className="bg-emerald-100 p-2 rounded-full">
                                <Bot className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div className="flex-1 pt-1">
                                <p className="text-sm text-gray-600 mb-3">
                                    Would you like to continue with our AI Health Assistant?
                                </p>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleConsult('patient')}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-sm"
                                    >
                                        Patient Consult
                                    </button>
                                    <button
                                        onClick={() => handleConsult('doctor')}
                                        className="border border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-3 py-1 rounded text-sm"
                                    >
                                        Provider Consult
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {assistantState.avatarActive && (
                <Link
                    to="/aiDoc"
                    className="fixed bottom-8 right-8 z-50 group cursor-pointer"
                >
                    <div className="relative">
                        <img
                            src={
                                assistantState.role === 'patient'
                                    ? 'https://i.ibb.co/5Wf0m8Fq/a-realistic-stunni-image.png'
                                    : 'https://i.ibb.co/5Wf0m8Fq/a-realistic-stunni-image.png'
                            }
                            alt={`${assistantState.role} avatar`}
                            className="w-24 h-24 rounded-full border-4 border-emerald-500 shadow-lg group-hover:scale-110 transition"
                        />
                        <div className="absolute bottom-0 right-0 bg-emerald-500 text-white rounded-full p-2 shadow-lg">
                            <MessageCircle className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="mt-2 text-white text-center capitalize">
                        {assistantState.role} AI Chat
                    </p>
                </Link>
            )}
        </>
    );
};

export default AIHealthAssistant;