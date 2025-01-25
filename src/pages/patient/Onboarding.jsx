import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Stethoscope,
  HeartHandshake,
  ShieldCheck,
  PersonStanding,
  Brain,
  Clock,
} from "lucide-react";

const Onboarding = () => {
  const [stage, setStage] = useState(0);
  const [showFullContent, setShowFullContent] = useState(false);

  const onboardingStages = [
    {
      title: "Holistic Health Ecosystem",
      description:
        "Your comprehensive health companion that goes beyond traditional tracking.",
      features: [
        {
          icon: <Stethoscope className="text-blue-600" size={36} />,
          title: "AI Health Analytics",
          detail:
            "Advanced predictive health insights using machine learning to help you make informed decisions.",
        },
        {
          icon: <Brain className="text-blue-400" size={36} />,
          title: "Mental Wellness Integration",
          detail:
            "Comprehensive mental health tracking and support tailored to your needs.",
        },
        {
          icon: <PersonStanding className="text-green-600" size={36} />,
          title: "Personalized Wellness Paths",
          detail:
            "Dynamic health recommendations tailored to your unique profile.",
        },
      ],
    },
    {
      title: "Connected Care Network",
      description:
        "Seamless integration of personal health data and professional insights.",
      features: [
        {
          icon: <HeartHandshake className="text-red-600" size={36} />,
          title: "Integrated Care Coordination",
          detail:
            "Real-time communication with healthcare providers to streamline your care.",
        },
        {
          icon: <Clock className="text-orange-500" size={36} />,
          title: "Predictive Health Forecasting",
          detail:
            "Proactive health risk assessment and prevention strategies based on your data.",
        },
        {
          icon: <Stethoscope className="text-blue-500" size={36} />,
          title: "Appointment Booking Made Easy",
          detail:
            "Schedule appointments with healthcare professionals at your convenience.",
        },
      ],
    },
    {
      title: "Privacy & Security First",
      description:
        "Your health data protected by state-of-the-art security protocols.",
      features: [
        {
          icon: <ShieldCheck className="text-emerald-600" size={36} />,
          title: "Advanced Encryption",
          detail:
            "Military-grade data protection and privacy mechanisms to keep your information safe.",
        },
        {
          icon: <Clock className="text-orange-400" size={36} />,
          title: "Timely Notifications",
          detail:
            "Receive reminders and alerts to keep you on top of your health appointments.",
        },
      ],
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setShowFullContent(true), 3000);
    const stageRotation = setInterval(() => {
      setStage((prev) => (prev + 1) % onboardingStages.length);
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(stageRotation);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-300 p-4 overflow-hidden">
      {!showFullContent ? (
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-8 animate-pulse">
            Health Connect
          </h1>
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white mx-auto"></div>
        </div>
      ) : (
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-blue-800 mb-4">
                {onboardingStages[stage].title}
              </h1>
              <p className="text-xl text-gray-700">
                {onboardingStages[stage].description}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {onboardingStages[stage].features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/90 p-6 rounded-2xl text-center transition-all duration-500 hover:scale-105 shadow"
                >
                  {feature.icon}
                  <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.detail}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-center space-x-3 mt-10">
              {onboardingStages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setStage(index)}
                  className={`h-3 w-3 rounded-full transition-all ${
                    index === stage
                      ? "bg-blue-600 w-8"
                      : "bg-blue-300 hover:bg-blue-400"
                  }`}
                />
              ))}
            </div>

            <div className="flex justify-center space-x-6 mt-12">
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-10 py-4 rounded-full font-semibold hover:bg-blue-500 transition transform hover:scale-105 shadow-xl"
              >
                Get Started
              </Link>
              <Link
                to="/signin"
                className="bg-transparent text-blue-600 px-10 py-4 rounded-full font-semibold border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition transform hover:scale-105"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
