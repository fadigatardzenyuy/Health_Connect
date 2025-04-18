import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Hospital,
  Calendar,
  FileText,
  MessageSquare,
  Users,
  Shield,
  Activity,
  ArrowRight,
  CheckCircle,
  Lock,
  Award,
  Zap,
  Ambulance,
  Bed,
  ClipboardList,
} from "lucide-react";
import AIHealthAssistant from "../components/AIHealthAssistant";
import { motion } from "framer-motion";

const Onboarding = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedRole, setSelectedRole] = useState("patient");

  useEffect(() => {
    setIsLoaded(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Animation settings
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.8, ease: "easeOut" },
    }),
  };

  const stats = [
    {
      icon: <Hospital className="w-5 h-5 text-emerald-400" />,
      value: "50+",
      label: "Hospitals",
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

  const RoleToggle = () => (
    <div className="flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full p-1 space-x-1">
      <Button
        variant={selectedRole === "patient" ? "solid" : "ghost"}
        onClick={() => setSelectedRole("patient")}
        className={`rounded-full text-xs ${
          selectedRole === "patient"
            ? "bg-emerald-500 text-white"
            : "text-white hover:bg-white/10"
        }`}
      >
        Patient
      </Button>
      <Button
        variant={selectedRole === "hospital-admin" ? "solid" : "ghost"}
        onClick={() => setSelectedRole("hospital-admin")}
        className={`rounded-full text-xs ${
          selectedRole === "hospital-admin"
            ? "bg-teal-500 text-white"
            : "text-white hover:bg-white/10"
        }`}
      >
        Hospital
      </Button>
    </div>
  );

  const roleContent = {
    patient: {
      icon: <Users className="h-5 w-5 text-emerald-600" />,
      title: "For Patients",
      features: [
        {
          icon: <Calendar className="h-3 w-3 mr-1 text-emerald-500" />,
          text: "Book hospital appointments",
        },
        {
          icon: <Ambulance className="h-3 w-3 mr-1 text-emerald-500" />,
          text: "Emergency services access",
        },
        {
          icon: <FileText className="h-3 w-3 mr-1 text-emerald-500" />,
          text: "Access medical records",
        },
      ],
      button: {
        text: "Sign Up as Patient",
        onClick: () => navigate("/signup?role=patient"),
      },
    },
    hospital: {
      icon: <Hospital className="h-5 w-5 text-teal-600" />,
      title: "For Hospitals",
      features: [
        {
          icon: <ClipboardList className="h-3 w-3 mr-1 text-teal-500" />,
          text: "Patient management system",
        },
        {
          icon: <Bed className="h-3 w-3 mr-1 text-teal-500" />,
          text: "Bed availability tracking",
        },
        {
          icon: <Zap className="h-3 w-3 mr-1 text-teal-500" />,
          text: "AI-powered patient triage",
        },
      ],
      button: {
        text: "Register Your Hospital",
        onClick: () => navigate("/signup?role=hospital-admin"),
      },
    },
  };

  // We use a single "step" structure for mobile. For desktop, we display all sections together.
  const steps = [
    // Step 0: Intro & Stats
    <motion.div
      key="intro"
      initial="hidden"
      animate={isLoaded ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
      }}
      className="flex flex-col items-center justify-center h-full text-center space-y-2"
    >
      <motion.div variants={fadeIn} custom={0} className="space-y-1">
        <div className="flex items-center justify-center space-x-2">
          <Heart className="w-5 h-5 text-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-semibold tracking-wider">
            TRANSFORMING HEALTHCARE
          </span>
        </div>
        <motion.h1 className="text-3xl font-bold text-white leading-tight">
          HOSPITAL CONNECT
        </motion.h1>
        <motion.p
          variants={fadeIn}
          custom={1}
          className="text-xs text-emerald-100/90 leading-snug mx-auto"
        >
          Bridging patients and hospitals for better healthcare in Cameroon.
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
            className="bg-white/10 backdrop-blur-sm rounded-sm p-1 flex flex-col items-center justify-center"
          >
            {stat.icon}
            <span className="text-xs font-bold text-white">{stat.value}</span>
            <span className="text-emerald-200 text-[10px]">{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>
      <motion.button
        variants={fadeIn}
        custom={7}
        onClick={() => setActiveStep(1)}
        className="mt-1 px-3 py-1 bg-emerald-500 text-white rounded-full flex items-center text-xs"
      >
        Get Started
        <ArrowRight className="ml-1 h-4 w-4" />
      </motion.button>
    </motion.div>,
    // Step 1: Role Selection
    <motion.div
      key="roles"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-full space-y-2"
    >
      <h2 className="text-base font-bold text-white mb-1">Choose Your Role</h2>
      <RoleToggle />
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full p-2 bg-white/90 backdrop-blur-md rounded-sm border border-emerald-500/20"
      >
        <div className="flex items-center mb-1">
          <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center mr-2">
            {roleContent[selectedRole].icon}
          </div>
          <h3 className="text-sm font-bold text-emerald-800">
            {roleContent[selectedRole].title}
          </h3>
        </div>
        <ul className="space-y-1 text-xs text-gray-700 mb-1">
          {roleContent[selectedRole].features.map((item, i) => (
            <li key={i} className="flex items-center">
              {item.icon}
              {item.text}
            </li>
          ))}
        </ul>
        <Button
          onClick={roleContent[selectedRole].button.onClick}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-1"
        >
          {roleContent[selectedRole].button.text}
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </motion.div>
      <div className="flex space-x-2 mt-1">
        <Button
          variant="ghost"
          onClick={() => setActiveStep(0)}
          className="text-white hover:text-emerald-400 hover:bg-white/10 text-xs"
        >
          Back
        </Button>
        <Button
          variant="ghost"
          onClick={() => setActiveStep(2)}
          className="text-white hover:text-emerald-400 hover:bg-white/10 text-xs"
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
      className="flex flex-col items-center justify-center h-full space-y-2"
    >
      <h2 className="text-base font-bold text-white mb-1 flex items-center">
        <Award className="mr-1 h-5 w-5 text-emerald-400" />
        Premium Features
      </h2>
      <div className="grid grid-cols-1 gap-2 w-full">
        {[
          {
            icon: <Lock className="h-5 w-5 text-emerald-400 mb-1" />,
            title: "Secure Records",
            description: "Encrypted medical data",
          },
          {
            icon: <Ambulance className="h-5 w-5 text-emerald-400 mb-1" />,
            title: "Emergency Services",
            description: "Fast hospital connections",
          },
          {
            icon: <Bed className="h-5 w-5 text-emerald-400 mb-1" />,
            title: "Bed Availability",
            description: "Real-time hospital capacity",
          },
          {
            icon: <MessageSquare className="h-5 w-5 text-emerald-400 mb-1" />,
            title: "Hospital Communication",
            description: "Direct messaging system",
          },
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="bg-white/5 p-1 rounded-sm border border-emerald-400/10"
          >
            <div className="flex items-center">
              {feature.icon}
              <div className="ml-2">
                <h3 className="text-xs font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-emerald-100/80 text-[10px]">
                  {feature.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex flex-col items-center space-y-1 mt-1">
        <p className="text-white/80 text-xs">Already have an account?</p>
        <Button
          variant="ghost"
          onClick={() => navigate("/signin")}
          className="text-white hover:text-emerald-400 hover:bg-white/10 border border-white/20 text-xs"
        >
          <span className="mr-1">Sign In</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>,
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* For desktop, use h-screen with overflow-hidden so no scrolling occurs */}
      <div
        className={`relative ${
          isMobile ? "min-h-screen" : "h-screen overflow-hidden"
        } flex items-center justify-center`}
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-emerald-800/85 to-teal-900/90" />
          <div className="absolute inset-0 bg-[url('https://i.ibb.co/mVhPFYy3/A-doctor-in-a-modern-clinic-treating-a-patient-The-doctor-a-middle-aged-male-is-examining-the-patien.png')] opacity-10" />
        </div>
        <div className="relative z-10 w-full h-full px-2 py-4 flex items-center justify-center">
          {isMobile ? (
            <div className="w-full max-w-md">{steps[activeStep]}</div>
          ) : (
            <motion.div
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.15 } },
              }}
              className="max-w-5xl mx-auto text-center space-y-2"
            >
              {/* Logo and Title */}
              <motion.div variants={fadeIn} custom={0} className="space-y-1">
                <div className="flex items-center justify-center space-x-2">
                  <Heart className="w-5 h-5 text-emerald-400 animate-pulse" />
                  <span className="text-xs text-emerald-400 font-semibold tracking-wider uppercase">
                    Transforming Healthcare Delivery
                  </span>
                </div>
                <motion.h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
                  HOSPITAL CONNECT
                </motion.h1>
                <motion.p
                  variants={fadeIn}
                  custom={2}
                  className="text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-2xl mx-auto"
                >
                  Bridging patients and hospitals for better healthcare in
                  Cameroon.
                  <span className="hidden sm:inline">
                    {" "}
                    Connecting patients with premier hospitals through
                    innovative technology.
                  </span>
                </motion.p>
              </motion.div>
              {/* Stats */}
              <motion.div
                variants={fadeIn}
                custom={3}
                className="grid grid-cols-4 gap-2 max-w-3xl mx-auto"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={fadeIn}
                    custom={index + 4}
                    className="bg-white/10 backdrop-blur-sm rounded-md p-2 flex flex-col items-center justify-center border border-emerald-400/20"
                  >
                    {stat.icon}
                    <span className="text-lg font-bold text-white mt-1">
                      {stat.value}
                    </span>
                    <span className="text-emerald-200 text-xs">
                      {stat.label}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
              {/* Role Selection */}
              <motion.div variants={fadeIn} custom={4} className="space-y-2">
                <RoleToggle />
                <motion.div className="grid gap-3 md:grid-cols-2 max-w-3xl mx-auto">
                  {/* Patient Card */}
                  <motion.div
                    className="group relative"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="p-4 bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-emerald-500/20">
                      <div className="flex items-center mb-3">
                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center mr-2">
                          {roleContent.patient.icon}
                        </div>
                        <h3 className="text-lg font-bold text-emerald-800">
                          {roleContent.patient.title}
                        </h3>
                      </div>
                      <ul className="space-y-1 text-gray-700 mb-3">
                        {roleContent.patient.features.map((item, i) => (
                          <li key={i} className="flex items-center">
                            {item.icon}
                            {item.text}
                          </li>
                        ))}
                      </ul>
                      <Button
                        onClick={roleContent.patient.button.onClick}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        {roleContent.patient.button.text}
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                  {/* Hospital Card */}
                  <motion.div
                    className="group relative"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="p-4 bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-teal-500/20">
                      <div className="flex items-center mb-3">
                        <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center mr-2">
                          {roleContent.hospital.icon}
                        </div>
                        <h3 className="text-lg font-bold text-teal-800">
                          {roleContent.hospital.title}
                        </h3>
                      </div>
                      <ul className="space-y-1 text-gray-700 mb-3">
                        {roleContent.hospital.features.map((item, i) => (
                          <li key={i} className="flex items-center">
                            {item.icon}
                            {item.text}
                          </li>
                        ))}
                      </ul>
                      <Button
                        onClick={roleContent.hospital.button.onClick}
                        variant="outline"
                        className="w-full border-2 border-teal-600 text-teal-700 hover:bg-teal-600 hover:text-white"
                      >
                        {roleContent.hospital.button.text}
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
              {/* Features Section */}
              <motion.div
                variants={fadeIn}
                custom={5}
                className="max-w-3xl mx-auto px-4 py-4 bg-white/10 backdrop-blur-md rounded-xl border border-emerald-400/20"
              >
                <h2 className="text-xl font-bold text-white mb-3 flex items-center justify-center">
                  <Award className="mr-2 h-5 w-5 text-emerald-400" />
                  Premium Features
                </h2>
                <div className="grid md:grid-cols-4 gap-3">
                  {[
                    {
                      icon: <Lock className="h-5 w-5 text-emerald-400 mb-1" />,
                      title: "Secure Records",
                      description: "Encrypted medical data",
                    },
                    {
                      icon: (
                        <Ambulance className="h-5 w-5 text-emerald-400 mb-1" />
                      ),
                      title: "Emergency",
                      description: "Fast hospital connections",
                    },
                    {
                      icon: <Bed className="h-5 w-5 text-emerald-400 mb-1" />,
                      title: "Bed Tracking",
                      description: "Real-time availability",
                    },
                    {
                      icon: (
                        <MessageSquare className="h-5 w-5 text-emerald-400 mb-1" />
                      ),
                      title: "Communication",
                      description: "Direct messaging",
                    },
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      variants={fadeIn}
                      custom={i + 6}
                      className="bg-white/5 p-2 rounded-lg border border-emerald-400/10"
                    >
                      {feature.icon}
                      <h3 className="text-sm font-semibold text-white mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-emerald-100/80 text-xs">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              {/* Sign In Link */}
              <motion.div variants={fadeIn} custom={6} className="text-center">
                <p className="text-white/80 mb-2 text-sm">
                  Already have an account?
                </p>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/signin")}
                  className="text-white hover:text-emerald-400 hover:bg-white/10 border border-white/20 text-sm"
                >
                  <span className="mr-1">Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
        {/* Floating AI Health Assistant */}
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
