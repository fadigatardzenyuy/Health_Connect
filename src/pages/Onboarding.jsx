import React, { useEffect, useState } from "react";
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
  CheckCircle,
  Clock,
  Database,
  Lock,
  Award,
  Zap,
} from "lucide-react";
import AIHealthAssistant from "../components/AIHealthAssistant";
import { motion } from "framer-motion";

const Onboarding = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: "easeOut",
      },
    }),
  };

  const stats = [
    {
      icon: <Users className="w-6 h-6 text-emerald-400" />,
      value: "500+",
      label: "Healthcare Providers",
    },
    {
      icon: <Activity className="w-6 h-6 text-emerald-400" />,
      value: "24/7",
      label: "Support Available",
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-emerald-400" />,
      value: "15K+",
      label: "Patients Served",
    },
    {
      icon: <Shield className="w-6 h-6 text-emerald-400" />,
      value: "100%",
      label: "Data Security",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Enhanced Background */}
      <div className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        {/* Background with enhanced effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-emerald-800/85 to-teal-900/90" />
          <div className="absolute inset-0 bg-[url('https://i.ibb.co/mVhPFYy3/A-doctor-in-a-modern-clinic-treating-a-patient-The-doctor-a-middle-aged-male-is-examining-the-patien.png')] opacity-10" />

          {/* Animated particles */}
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-emerald-400/20"
                style={{
                  width: `${Math.random() * 20 + 5}px`,
                  height: `${Math.random() * 20 + 5}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float ${
                    Math.random() * 10 + 15
                  }s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
          </div>

          {/* Abstract medical patterns */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="medicalPattern"
                  x="0"
                  y="0"
                  width="100"
                  height="100"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M30,50 L70,50 M50,30 L50,70"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="20"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#medicalPattern)" />
            </svg>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full mx-auto px-6 py-12 sm:py-0">
          <motion.div
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
            className="max-w-6xl mx-auto text-center space-y-10"
          >
            {/* Logo and Title Section */}
            <motion.div variants={fadeIn} custom={0} className="space-y-6">
              <div className="flex items-center justify-center space-x-3">
                <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400 animate-pulse" />
                <span className="text-sm sm:text-base text-emerald-400 font-semibold tracking-wider uppercase">
                  Transforming Healthcare Delivery
                </span>
                <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400 animate-pulse" />
              </div>

              <motion.h1
                className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight tracking-tight"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: 0.1,
                      duration: 0.8,
                      ease: "easeOut",
                    },
                  },
                }}
              >
                Cameroon Health
                <motion.span
                  className="block bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent"
                  variants={{
                    hidden: { opacity: 0, scale: 0.95 },
                    visible: {
                      opacity: 1,
                      scale: 1,
                      transition: {
                        delay: 0.3,
                        duration: 0.8,
                        ease: "easeOut",
                      },
                    },
                  }}
                >
                  Connect
                </motion.span>
              </motion.h1>

              <motion.p
                variants={fadeIn}
                custom={2}
                className="text-xl sm:text-2xl md:text-3xl text-emerald-100/90 leading-relaxed max-w-3xl mx-auto"
              >
                Experience the future of healthcare delivery in Cameroon.
                <span className="hidden sm:inline">
                  {" "}
                  Connecting patients with premier healthcare providers through
                  innovative technology.
                </span>
              </motion.p>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              variants={fadeIn}
              custom={3}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        delay: 0.4 + index * 0.1,
                        duration: 0.5,
                      },
                    },
                  }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center border border-emerald-400/20"
                >
                  {stat.icon}
                  <span className="text-2xl font-bold text-white mt-2">
                    {stat.value}
                  </span>
                  <span className="text-emerald-200 text-sm">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Card Options */}
            <motion.div
              variants={fadeIn}
              custom={4}
              className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto"
            >
              <motion.div
                className="group relative"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl transform transition-all duration-300 -z-10 group-hover:blur-xl" />
                <div className="p-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300">
                  <div className="flex items-center mb-5">
                    <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
                      <Users className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-emerald-800">
                      For Patients
                    </h3>
                  </div>

                  <ul className="space-y-3 text-gray-700 mb-6">
                    {[
                      {
                        icon: (
                          <Calendar className="h-4 w-4 mr-2 text-emerald-500" />
                        ),
                        text: "Book consultations online",
                      },
                      {
                        icon: (
                          <FileText className="h-4 w-4 mr-2 text-emerald-500" />
                        ),
                        text: "Access medical records securely",
                      },
                      {
                        icon: (
                          <MessageSquare className="h-4 w-4 mr-2 text-emerald-500" />
                        ),
                        text: "Chat with healthcare providers",
                      },
                      {
                        icon: (
                          <Clock className="h-4 w-4 mr-2 text-emerald-500" />
                        ),
                        text: "Receive timely appointment reminders",
                      },
                    ].map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="flex items-center"
                      >
                        {item.icon}
                        {item.text}
                      </motion.li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => navigate("/signup?role=patient")}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      Sign Up as Patient
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </div>
              </motion.div>

              <motion.div
                className="group relative"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-2xl transform transition-all duration-300 -z-10 group-hover:blur-xl" />
                <div className="p-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-teal-500/20 hover:border-teal-500/40 transition-all duration-300">
                  <div className="flex items-center mb-5">
                    <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                      <Stethoscope className="h-6 w-6 text-teal-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-teal-800">
                      For Healthcare Providers
                    </h3>
                  </div>

                  <ul className="space-y-3 text-gray-700 mb-6">
                    {[
                      {
                        icon: (
                          <Calendar className="h-4 w-4 mr-2 text-teal-500" />
                        ),
                        text: "Manage patient appointments",
                      },
                      {
                        icon: (
                          <Database className="h-4 w-4 mr-2 text-teal-500" />
                        ),
                        text: "Access patient records securely",
                      },
                      {
                        icon: <Users className="h-4 w-4 mr-2 text-teal-500" />,
                        text: "Collaborate with other providers",
                      },
                      {
                        icon: <Zap className="h-4 w-4 mr-2 text-teal-500" />,
                        text: "Utilize AI-powered diagnostic tools",
                      },
                    ].map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                        className="flex items-center"
                      >
                        {item.icon}
                        {item.text}
                      </motion.li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => navigate("/signup?role=doctor")}
                    variant="outline"
                    className="w-full border-2 border-teal-600 text-teal-700 hover:bg-teal-600 hover:text-white group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      Join as Healthcare Provider
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </div>
              </motion.div>
            </motion.div>

            {/* Features Section */}
            <motion.div
              variants={fadeIn}
              custom={5}
              className="max-w-4xl mx-auto px-6 py-8 bg-white/10 backdrop-blur-md rounded-2xl border border-emerald-400/20"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center justify-center">
                <Award className="mr-3 h-6 w-6 text-emerald-400" />
                Premium Features
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: <Lock className="h-8 w-8 text-emerald-400 mb-3" />,
                    title: "Secure Records",
                    description:
                      "End-to-end encrypted medical data storage and sharing",
                  },
                  {
                    icon: <Zap className="h-8 w-8 text-emerald-400 mb-3" />,
                    title: "AI Diagnostics",
                    description:
                      "Advanced analysis tools for healthcare providers",
                  },
                  {
                    icon: (
                      <MessageSquare className="h-8 w-8 text-emerald-400 mb-3" />
                    ),
                    title: "Telemedicine",
                    description:
                      "Connect with doctors remotely, anytime, anywhere",
                  },
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.2 }}
                    className="bg-white/5 p-5 rounded-xl border border-emerald-400/10 hover:border-emerald-400/30 transition-all duration-300"
                  >
                    {feature.icon}
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-emerald-100/80 text-sm">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Sign In Link */}
            <motion.div
              variants={fadeIn}
              custom={6}
              className="text-center mt-10"
            >
              <p className="text-white/80 mb-4">Already have an account?</p>
              <Button
                variant="ghost"
                onClick={() => navigate("/signin")}
                className="text-white hover:text-emerald-400 hover:bg-white/10 border border-white/20 hover:border-emerald-400/30"
              >
                <span className="mr-2">Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating AI Health Assistant Button with animation */}
        <div className="absolute bottom-8 right-8 z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <AIHealthAssistant />
          </motion.div>
        </div>

        {/* Add a subtle floating animation to the page */}
        <style jsx global>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Onboarding;
