
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


const SuggestionCategories = ({ onPromptSelect, selectedPrompt }) => {
    const suggestedPromptCategories = [
        {
            category: "Diagnostic Insights",
            icon: Stethoscope,
            prompts: [
                "Analyze Complex Symptoms",
                "Interpret Medical Tests",
                "Rare Condition Research"
            ]
        },
        {
            category: "Wellness Optimization",
            icon: HeartPulse,
            prompts: [
                "Personalized Nutrition Plan",
                "Mental Wellness Strategy",
                "Fitness Recommendations"
            ]
        },
        {
            category: "Medical Navigation",
            icon: Activity,
            prompts: [
                "Specialist Finder",
                "Medication Comprehension",
                "Healthcare Resource Guide"
            ]
        }
    ];

    return (
        <div className="p-4 space-y-4 bg-gradient-to-br from-emerald-50 to-teal-50">
            {suggestedPromptCategories.map((category, catIndex) => (
                <div key={catIndex} className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-md hover:shadow-lg transition-all">
                    <div className="flex items-center mb-3 space-x-3">
                        <category.icon className="w-6 h-6 text-emerald-600" />
                        <h3 className="text-lg font-bold text-emerald-900 tracking-tight">
                            {category.category}
                        </h3>
                    </div>
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        {category.prompts.map((prompt, index) => (
                            <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className={`
                  transition-all duration-300
                  ${selectedPrompt === prompt
                                        ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                                        : 'bg-white/70 border-emerald-200 text-emerald-700 hover:bg-emerald-50'}
                `}
                                onClick={() => onPromptSelect(prompt === selectedPrompt ? null : prompt)}
                            >
                                {prompt}
                            </Button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SuggestionCategories