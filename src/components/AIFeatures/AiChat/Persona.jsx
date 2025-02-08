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

// AI Persona Component
const AIPersonaHeader = () => {
    return (
        <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-4 flex items-center justify-between shadow-sm border-b border-emerald-100">
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-emerald-500 shadow-lg transform transition-transform hover:scale-105">
                        <img
                            src="https://i.ibb.co/5Wf0m8Fq/a-realistic-stunni-image.png"
                            alt="AiDoc AI Assistant"
                            className="w-full h-full object-cover filter brightness-110 saturate-150"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/40 to-teal-500/40 mix-blend-overlay"></div>
                    </div>
                    <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></span>
                </div>

                <div>
                    <h2 className="text-2xl font-extrabold text-emerald-900 tracking-tight">AiDoc</h2>
                    <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <p className="text-sm text-emerald-700 font-medium">AI Medical Intelligence</p>
                    </div>
                </div>
            </div>
            <div className="flex space-x-2">
                <Button variant="ghost" size="icon" className="text-emerald-600 hover:bg-emerald-100">
                    <Award className="w-6 h-6" />
                </Button>
                <Button variant="ghost" size="icon" className="text-emerald-600 hover:bg-emerald-100">
                    <ShieldCheck className="w-6 h-6" />
                </Button>
            </div>
        </div>
    );
};

// Suggestion Categories Component
export default AIPersonaHeader

// Main AiDoc Interface
