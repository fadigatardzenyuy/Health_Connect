import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { RiskAssessment } from "@/components/AIFeatures/PredictiveAnalytics/RiskAssessment";
import { OutbreakDetection } from "@/components/AIFeatures/PredictiveAnalytics/OutbreakDetection";
import {
  Heart,
  Stethoscope,
  Calendar,
  FileText,
  MessageSquare,
  Users,
  Shield,
  Activity,
  ArrowRight,
} from "lucide-react";
import AIHealthAssistant from "../components/AIHealthAssistant";

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background */}
      <div className="relative min-h-[100vh] sm:min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://i.ibb.co/35rJDpWN/image-2.png"
            alt="Medical Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-emerald-800/85 to-teal-900/90" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDUwIDAgTCAwIDAgMCA1MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-[90%] mx-auto px-4 py-12 sm:py-0">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-2">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 animate-pulse" />
                <span className="text-sm sm:text-base text-emerald-400 font-semibold tracking-wider">
                  TRANSFORMING HEALTHCARE
                </span>
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 animate-pulse" />
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight px-2">
                Cameroon Health
                <span className="block bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  Connect
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-emerald-100/90 leading-relaxed px-1 w-[95%] mx-auto">
                Experience the future of healthcare delivery in Cameroon.
                Connecting patients with premier healthcare providers.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 max-w-3xl mx-auto mb-12">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl transform group-hover:scale-105 transition-transform duration-300 -z-10" />
                <div className="p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-primary/10">
                  <h3 className="text-2xl font-semibold text-primary mb-4">
                    For Patients
                  </h3>
                  <ul className="space-y-3 text-gray-600 mb-6">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2" />
                      Book consultations online
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2" />
                      Access medical records
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2" />
                      Chat with healthcare providers
                    </li>
                  </ul>
                  <Button
                    onClick={() => navigate("/signup?role=patient")}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    Sign Up as Patient
                  </Button>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-2xl transform group-hover:scale-105 transition-transform duration-300 -z-10" />
                <div className="p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-secondary/10">
                  <h3 className="text-2xl font-semibold text-secondary mb-4">
                    For Healthcare Providers
                  </h3>
                  <ul className="space-y-3 text-gray-600 mb-6">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-secondary rounded-full mr-2" />
                      Manage patient appointments
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-secondary rounded-full mr-2" />
                      Access patient records securely
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-secondary rounded-full mr-2" />
                      Collaborate with other providers
                    </li>
                  </ul>
                  <Button
                    onClick={() => navigate("/signup?role=doctor")}
                    variant="outline"
                    className="w-full border-secondary text-secondary hover:bg-secondary hover:text-white"
                  >
                    Join as Healthcare Provider
                  </Button>
                </div>
              </div>
            </div>

            {/* AI Features Section */}
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 mx-auto mb-16 mt-8">
              <RiskAssessment />
              <OutbreakDetection />
            </div>

            <div className="text-center">
              <p className="text-white-600 mb-4">Already have an account?</p>
              <Button
                variant="ghost"
                onClick={() => navigate("/signin")}
                className="text-white hover:text-primary/90 hover:bg-primary/10"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
        <AIHealthAssistant />
      </div>
    </div>
  );
};

export default Onboarding;
