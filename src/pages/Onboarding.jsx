import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { RiskAssessment } from "@/components/AIFeatures/PredictiveAnalytics/RiskAssessment";
import { OutbreakDetection } from "@/components/AIFeatures/PredictiveAnalytics/OutbreakDetection";
import { Heart, Stethoscope, Calendar, FileText, MessageSquare, Users, Shield, Activity, ArrowRight } from 'lucide-react';
import AIHealthAssistant from '../components/AIHealthAssistant';

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
                <span className="text-sm sm:text-base text-emerald-400 font-semibold tracking-wider">TRANSFORMING HEALTHCARE</span>
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 animate-pulse" />
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight px-2">
                Cameroon Health
                <span className="block bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  Connect
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-emerald-100/90 leading-relaxed px-1 w-[95%] mx-auto">
                Experience the future of healthcare delivery in Cameroon. Connecting patients
                with premier healthcare providers.
              </p>
            </div>

            {/* Mobile-optimized buttons */}
            <div className="flex flex-col w-[90%] mx-auto gap-4 mt-8">
              <Button
                onClick={() => navigate("/signup")}
                className="w-full h-14 text-lg bg-emerald-500 hover:bg-emerald-600 text-white active:scale-95 touch-none group"
              >
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/learn-more")}
                className="w-full h-14 text-lg border-2 border-emerald-400 text-emerald-400 hover:bg-emerald-400/10 active:scale-95 touch-none"
              >
                Learn More
              </Button>
            </div>

            {/* Mobile-optimized stats */}
            <div className="grid grid-cols-2 gap-3 mt-12 w-[90%] mx-auto">
              {[
                { number: "1000+", label: "Healthcare Providers" },
                { number: "50K+", label: "Patients Served" },
                { number: "24/7", label: "Support Available" },
                { number: "98%", label: "Satisfaction Rate" },
              ].map((stat, index) => (
                <div key={index} className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-400">{stat.number}</div>
                  <div className="text-xs sm:text-sm text-emerald-100/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-b from-emerald-900 to-gray-100">
        <div className="w-[90%] mx-auto py-16">
          <div className="max-w-5xl mx-auto">
            {/* Cards Section */}
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 mx-auto -mt-32 relative z-20">
              {/* Patient Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-3xl transform group-hover:scale-105 transition-all duration-500 ease-out -z-10 blur-xl" />
                <div className="p-6 sm:p-8 bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-emerald-500/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 sm:p-3 bg-emerald-500/10 rounded-xl">
                      <Users className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-emerald-800">For Patients</h3>
                  </div>
                  <ul className="space-y-4 text-gray-600 mb-6">
                    <li className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-emerald-600/60 flex-shrink-0" />
                      <span className="text-base sm:text-lg">Smart appointment scheduling</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-emerald-600/60 flex-shrink-0" />
                      <span className="text-base sm:text-lg">Secure medical records access</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-emerald-600/60 flex-shrink-0" />
                      <span className="text-base sm:text-lg">24/7 provider communication</span>
                    </li>
                  </ul>
                  <Button
                    onClick={() => navigate("/signup")}
                    className="w-full h-14 text-base sm:text-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 touch-none"
                  >
                    Begin Your Health Journey
                  </Button>
                </div>
              </div>

              {/* Provider Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-3xl transform group-hover:scale-105 transition-all duration-500 ease-out -z-10 blur-xl" />
                <div className="p-6 sm:p-8 bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-teal-500/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 sm:p-3 bg-teal-500/10 rounded-xl">
                      <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-teal-800">For Providers</h3>
                  </div>
                  <ul className="space-y-4 text-gray-600 mb-6">
                    <li className="flex items-center gap-3">
                      <Activity className="w-5 h-5 text-teal-600/60 flex-shrink-0" />
                      <span className="text-base sm:text-lg">Advanced patient management</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-teal-600/60 flex-shrink-0" />
                      <span className="text-base sm:text-lg">HIPAA-compliant platform</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-teal-600/60 flex-shrink-0" />
                      <span className="text-base sm:text-lg">Professional network access</span>
                    </li>
                  </ul>
                  <Button
                    onClick={() => navigate("/signup")}
                    variant="outline"
                    className="w-full h-14 text-base sm:text-lg border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white active:scale-95 touch-none"
                  >
                    Join Our Medical Network
                  </Button>
                </div>
              </div>
            </div>

            {/* AI Features Section */}
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 mx-auto mb-16 mt-8">
              <RiskAssessment />
              <OutbreakDetection />
            </div>

            {/* Sign In Section */}
            <div className="text-center space-y-6">
              <p className="text-base sm:text-lg text-gray-600">Already part of our medical community?</p>
              <Button
                variant="ghost"
                onClick={() => navigate("/signin")}
                className="w-[90%] h-14 text-base sm:text-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 active:scale-95 touch-none"
              >
                Sign In to Your Account
              </Button>
            </div>
          </div>
        </div>
      </div>
      <AIHealthAssistant />
    </div>
  );
};

export default Onboarding;