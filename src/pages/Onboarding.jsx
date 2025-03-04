import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
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
  const [activeStep, setActiveStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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
      icon: <Users className="w-5 h-5 text-emerald-400" />,
      value: "500+",
      label: "Providers",
    },
    {
      icon: <Activity className="w-5 h-5 text-emerald-400" />,
      value: "24/7",
      label: "Support",
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
      value: "15K+",
      label: "Patients",
    },
    {
      icon: <Shield className="w-5 h-5 text-emerald-400" />,
      value: "100%",
      label: "Security",
    },
  ];

  // Content steps for mobile
  const steps = [
    // Step 0: Intro & Stats
    <motion.div
      key="intro"
      initial="hidden"
      animate={isLoaded ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className="flex flex-col items-center justify-center h-full text-center space-y-4"
    >
      <motion.div variants={fadeIn} custom={0} className="space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Heart className="w-5 h-5 text-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-semibold tracking-wider">
            TRANSFORMING HEALTHCARE
          </span>
        </div>

        <motion.h1 className="text-4xl font-bold text-white leading-tight">
          WAHPITA
          <motion.span className="block bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            Connect
          </motion.span>
        </motion.h1>

        <motion.p
          variants={fadeIn}
          custom={1}
          className="text-lg text-emerald-100/90 leading-snug mx-auto"
        >
          Experience the future of healthcare delivery in Cameroon.
        </motion.p>
      </motion.div>

      <motion.div
        variants={fadeIn}
        custom={2}
        className="grid grid-cols-4 gap-2 w-full"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={fadeIn}
            custom={index + 3}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-2 flex flex-col items-center justify-center"
          >
            {stat.icon}
            <span className="text-lg font-bold text-white">{stat.value}</span>
            <span className="text-emerald-200 text-xs">{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>

      <motion.button
        variants={fadeIn}
        custom={7}
        onClick={() => setActiveStep(1)}
        className="mt-4 px-6 py-2 bg-emerald-500 text-white rounded-full flex items-center"
      >
        Continue <ArrowRight className="ml-2 h-4 w-4" />
      </motion.button>
    </motion.div>,

    // Step 1: Role Selection
    <motion.div
      key="roles"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-full space-y-4"
    >
      <h2 className="text-2xl font-bold text-white mb-2">Choose Your Role</h2>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full p-4 bg-white/90 backdrop-blur-md rounded-xl border border-emerald-500/20"
      >
        <div className="flex items-center mb-3">
          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
            <Users className="h-5 w-5 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-emerald-800">For Patients</h3>
        </div>

        <ul className="space-y-2 text-sm text-gray-700 mb-3">
          {[
            {
              icon: <Calendar className="h-4 w-4 mr-2 text-emerald-500" />,
              text: "Book consultations online",
            },
            {
              icon: <FileText className="h-4 w-4 mr-2 text-emerald-500" />,
              text: "Access medical records",
            },
          ].map((item, i) => (
            <li key={i} className="flex items-center">
              {item.icon}
              {item.text}
            </li>
          ))}
        </ul>

        <Button
          onClick={() => navigate("/signup?role=patient")}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm py-1"
        >
          Sign Up as Patient
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full p-4 bg-white/90 backdrop-blur-md rounded-xl border border-teal-500/20"
      >
        <div className="flex items-center mb-3">
          <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center mr-3">
            <Stethoscope className="h-5 w-5 text-teal-600" />
          </div>
          <h3 className="text-xl font-bold text-teal-800">For Providers</h3>
        </div>

        <ul className="space-y-2 text-sm text-gray-700 mb-3">
          {[
            {
              icon: <Calendar className="h-4 w-4 mr-2 text-teal-500" />,
              text: "Manage appointments",
            },
            {
              icon: <Zap className="h-4 w-4 mr-2 text-teal-500" />,
              text: "AI-powered diagnostics",
            },
          ].map((item, i) => (
            <li key={i} className="flex items-center">
              {item.icon}
              {item.text}
            </li>
          ))}
        </ul>

        <Button
          onClick={() => navigate("/signup?role=doctor")}
          variant="outline"
          className="w-full border-2 border-teal-600 text-teal-700 hover:bg-teal-600 hover:text-white text-sm py-1"
        >
          Join as Healthcare Provider
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>

      <div className="flex space-x-4 mt-2">
        <Button
          variant="ghost"
          onClick={() => setActiveStep(0)}
          className="text-white hover:text-emerald-400 hover:bg-white/10 text-sm"
        >
          Back
        </Button>
        <Button
          variant="ghost"
          onClick={() => setActiveStep(2)}
          className="text-white hover:text-emerald-400 hover:bg-white/10 text-sm"
        >
          Next
        </Button>
      </div>
    </motion.div>,

    // Step 2: Features
    <motion.div
      key="features"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-full space-y-4"
    >
      <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
        <Award className="mr-2 h-5 w-5 text-emerald-400" />
        Premium Features
      </h2>

      <div className="grid grid-cols-1 gap-3 w-full">
        {[
          {
            icon: <Lock className="h-6 w-6 text-emerald-400 mb-1" />,
            title: "Secure Records",
            description: "End-to-end encrypted data",
          },
          {
            icon: <Zap className="h-6 w-6 text-emerald-400 mb-1" />,
            title: "AI Diagnostics",
            description: "Advanced analysis tools",
          },
          {
            icon: <MessageSquare className="h-6 w-6 text-emerald-400 mb-1" />,
            title: "Telemedicine",
            description: "Connect with doctors remotely",
          },
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="bg-white/5 p-3 rounded-lg border border-emerald-400/10"
          >
            <div className="flex items-center">
              {feature.icon}
              <div className="ml-3">
                <h3 className="text-md font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-emerald-100/80 text-xs">
                  {feature.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col items-center space-y-3 mt-2">
        <p className="text-white/80 text-sm">Already have an account?</p>
        <Button
          variant="ghost"
          onClick={() => navigate("/signin")}
          className="text-white hover:text-emerald-400 hover:bg-white/10 border border-white/20 text-sm"
        >
          <span className="mr-2">Sign In</span>
          <ArrowRight className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          onClick={() => setActiveStep(1)}
          className="text-white hover:text-emerald-400 hover:bg-white/10 text-sm"
        >
          Back
        </Button>
      </div>
    </motion.div>,
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Background with enhanced effects */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-emerald-800/85 to-teal-900/90" />
          <div className="absolute inset-0 bg-[url('https://i.ibb.co/mVhPFYy3/A-doctor-in-a-modern-clinic-treating-a-patient-The-doctor-a-middle-aged-male-is-examining-the-patien.png')] opacity-10" />

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

        {/* Content - Conditional rendering based on device size */}
        <div className="relative z-10 w-full h-full px-4 py-6 flex items-center justify-center">
          {isMobile ? (
            // Mobile view with stepped approach
            <div className="w-full max-w-md">{steps[activeStep]}</div>
          ) : (
            // Desktop view (original content but slightly condensed)
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
              className="max-w-6xl mx-auto text-center space-y-8"
            >
              {/* Logo and Title Section */}
              <motion.div variants={fadeIn} custom={0} className="space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <Heart className="w-6 h-6 text-emerald-400 animate-pulse" />
                  <span className="text-sm text-emerald-400 font-semibold tracking-wider uppercase">
                    Transforming Healthcare Delivery
                  </span>
                </div>

                <motion.h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight">
                  WAHPITA
                  <motion.span className="block bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                    Connect
                  </motion.span>
                </motion.h1>

                <motion.p
                  variants={fadeIn}
                  custom={2}
                  className="text-xl text-emerald-100/90 leading-relaxed max-w-3xl mx-auto"
                >
                  Experience the future of healthcare delivery in Cameroon.
                  <span className="hidden sm:inline">
                    {" "}
                    Connecting patients with premier healthcare providers
                    through innovative technology.
                  </span>
                </motion.p>
              </motion.div>

              {/* Stats Section */}
              <motion.div
                variants={fadeIn}
                custom={3}
                className="grid grid-cols-4 gap-4 max-w-4xl mx-auto"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={fadeIn}
                    custom={index + 4}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center border border-emerald-400/20"
                  >
                    {stat.icon}
                    <span className="text-2xl font-bold text-white mt-2">
                      {stat.value}
                    </span>
                    <span className="text-emerald-200 text-sm">
                      {stat.label}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Card Options */}
              <motion.div
                variants={fadeIn}
                custom={4}
                className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto"
              >
                {/* Patient Card */}
                <motion.div
                  className="group relative"
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-emerald-500/20">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
                        <Users className="h-6 w-6 text-emerald-600" />
                      </div>
                      <h3 className="text-xl font-bold text-emerald-800">
                        For Patients
                      </h3>
                    </div>

                    <ul className="space-y-2 text-gray-700 mb-4">
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
                          text: "Access medical records",
                        },
                      ].map((item, i) => (
                        <li key={i} className="flex items-center">
                          {item.icon}
                          {item.text}
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => navigate("/signup?role=patient")}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Sign Up as Patient
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>

                {/* Provider Card */}
                <motion.div
                  className="group relative"
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-teal-500/20">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                        <Stethoscope className="h-6 w-6 text-teal-600" />
                      </div>
                      <h3 className="text-xl font-bold text-teal-800">
                        For Healthcare Providers
                      </h3>
                    </div>

                    <ul className="space-y-2 text-gray-700 mb-4">
                      {[
                        {
                          icon: (
                            <Calendar className="h-4 w-4 mr-2 text-teal-500" />
                          ),
                          text: "Manage appointments",
                        },
                        {
                          icon: <Zap className="h-4 w-4 mr-2 text-teal-500" />,
                          text: "AI-powered diagnostics",
                        },
                      ].map((item, i) => (
                        <li key={i} className="flex items-center">
                          {item.icon}
                          {item.text}
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => navigate("/signup?role=doctor")}
                      variant="outline"
                      className="w-full border-2 border-teal-600 text-teal-700 hover:bg-teal-600 hover:text-white"
                    >
                      Join as Healthcare Provider
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              </motion.div>

              {/* Features Section - Condensed */}
              <motion.div
                variants={fadeIn}
                custom={5}
                className="max-w-4xl mx-auto px-6 py-6 bg-white/10 backdrop-blur-md rounded-2xl border border-emerald-400/20"
              >
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center justify-center">
                  <Award className="mr-3 h-6 w-6 text-emerald-400" />
                  Premium Features
                </h2>

                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    {
                      icon: <Lock className="h-6 w-6 text-emerald-400 mb-2" />,
                      title: "Secure Records",
                      description: "Encrypted medical data",
                    },
                    {
                      icon: <Zap className="h-6 w-6 text-emerald-400 mb-2" />,
                      title: "AI Diagnostics",
                      description: "Advanced analysis tools",
                    },
                    {
                      icon: (
                        <MessageSquare className="h-6 w-6 text-emerald-400 mb-2" />
                      ),
                      title: "Telemedicine",
                      description: "Connect remotely",
                    },
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      variants={fadeIn}
                      custom={i + 6}
                      className="bg-white/5 p-4 rounded-xl border border-emerald-400/10"
                    >
                      {feature.icon}
                      <h3 className="text-lg font-semibold text-white mb-1">
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
              <motion.div variants={fadeIn} custom={6} className="text-center">
                <p className="text-white/80 mb-2">Already have an account?</p>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/signin")}
                  className="text-white hover:text-emerald-400 hover:bg-white/10 border border-white/20"
                >
                  <span className="mr-2">Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Floating AI Health Assistant Button */}
        <div className="absolute bottom-4 right-4 z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <AIHealthAssistant />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
