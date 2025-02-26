import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  Mail,
  Facebook,
  Twitter,
  User,
  Lock,
  ArrowRight,
  Heart,
  ShieldCheck,
  Clock,
  Users,
  MessageSquare,
  Calendar,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "patient";
  const [isLoading, setIsLoading] = useState(false);
  const [licenseError, setLicenseError] = useState("");
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
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  const testimonials = [
    {
      quote: "Health Connect transformed how I manage my health journey!",
      author: "Esther M.",
    },
    {
      quote:
        "Quick appointments and professional care - exactly what I needed.",
      author: "Jean P.",
    },
    {
      quote: "The doctors are responsive and the platform is easy to use.",
      author: "Robert K.",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return; // Prevent double submission
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const fullName = formData.get("name");
    const license = formData.get("license");

    try {
      // Attempt signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
            ...(role === "doctor" && { license_number: license }),
          },
        },
      });

      if (error) throw error;

      // Check if the user is authenticated
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      toast({
        title: "Account created successfully",
        description:
          role === "doctor"
            ? "Please complete your doctor verification process"
            : "Welcome to Health Connect!",
      });

      // Navigate based on role
      if (role === "doctor") {
        navigate("/doctor-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Error",
        description:
          error.message ||
          "An error occurred during sign up. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = (provider) => {
    toast({
      title: "Coming Soon",
      description: `Sign up with ${provider} functionality will be available soon!`,
    });

    setTimeout(() => {
      navigate("/dashboard"); // Redirect to the dashboard
    }, 1000);
  };

  const validateLicenseFormat = (license) => {
    const licenseFormat = /^[A-Z]{2}\d{6}$/;
    return licenseFormat.test(license);
  };

  const handleLicenseChange = (e) => {
    const value = e.target.value.toUpperCase();
    e.target.value = value;
    if (value && !validateLicenseFormat(value)) {
      setLicenseError(
        "License must be 2 uppercase letters followed by 6 digits (e.g., AB123456)"
      );
    } else {
      setLicenseError("");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Section - Creative Information About Health Platform */}
      <motion.div
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
        className="hidden md:flex w-1/2 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 justify-center items-center p-8 relative overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: `${Math.random() * 20 + 5}px`,
                height: `${Math.random() * 20 + 5}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 15}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        {/* Abstract pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="healthPattern"
                x="0"
                y="0"
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M25,0 L25,50 M0,25 L50,25"
                  stroke="white"
                  strokeWidth="1"
                />
                <circle
                  cx="25"
                  cy="25"
                  r="10"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#healthPattern)" />
          </svg>
        </div>

        <div className="relative z-10 text-center text-white max-w-xl">
          <motion.div
            variants={fadeIn}
            custom={0}
            className="flex items-center justify-center space-x-2 mb-4"
          >
            <Heart className="w-6 h-6 text-emerald-400 animate-pulse" />
            <span className="text-sm text-emerald-400 font-semibold tracking-wider uppercase">
              Your Health Journey Starts Here
            </span>
            <Heart className="w-6 h-6 text-emerald-400 animate-pulse" />
          </motion.div>

          <motion.h3
            variants={fadeIn}
            custom={1}
            className="text-4xl font-bold mb-4 drop-shadow-lg"
          >
            Welcome to{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              WAHPITA
            </span>
          </motion.h3>

          <motion.p
            variants={fadeIn}
            custom={2}
            className="mb-8 text-lg text-emerald-100/90"
          >
            Your health is our priority. Join us and gain access to personalized
            health plans, expert consultations, and a supportive community.
          </motion.p>

          {/* Feature Cards */}
          <motion.div
            variants={fadeIn}
            custom={3}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {[
              {
                icon: <Calendar className="w-5 h-5 text-emerald-400 mb-2" />,
                title: "Easy Scheduling",
                desc: "Book appointments with just a few clicks",
              },
              {
                icon: (
                  <MessageSquare className="w-5 h-5 text-emerald-400 mb-2" />
                ),
                title: "Expert Consultations",
                desc: "Connect with verified healthcare specialists",
              },
              {
                icon: <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />,
                title: "Secure Records",
                desc: "Your medical data is always protected",
              },
              {
                icon: <Clock className="w-5 h-5 text-emerald-400 mb-2" />,
                title: "24/7 Access",
                desc: "Healthcare resources available anytime",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: 0.3 + i * 0.1,
                      duration: 0.5,
                    },
                  },
                }}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-300"
              >
                <div className="flex flex-col items-center">
                  {feature.icon}
                  <h4 className="text-lg font-semibold">{feature.title}</h4>
                  <p className="text-sm text-emerald-100/80">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Testimonials Section */}
          <motion.div
            variants={fadeIn}
            custom={7}
            className="mt-8 border-t border-emerald-400/20 pt-6"
          >
            <h4 className="text-lg font-semibold mb-3">What Our Users Say</h4>
            <div className="relative h-24 overflow-hidden">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: 0.8 + index * 0.1,
                      duration: 0.5,
                    },
                  }}
                  className="text-center"
                >
                  <p className="italic text-emerald-100/90">
                    "{testimonial.quote}"
                  </p>
                  <p className="mt-2 font-medium text-emerald-400">
                    - {testimonial.author}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Section - Sign Up Form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-center w-full md:w-1/2"
      >
        <div className="w-full max-w-md px-6 lg:px-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {role === "doctor"
                ? "Join our network of healthcare professionals"
                : "Start your health journey with us"}
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 bg-white py-8 px-6 shadow-lg sm:rounded-xl border border-emerald-100"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="name" className="text-gray-700">
                  Full Name
                </Label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="pl-10 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-700">
                  Email address
                </Label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="pl-10 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="pl-10 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {role === "doctor" && (
                <div>
                  <Label htmlFor="license" className="text-gray-700">
                    Medical License Number
                  </Label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ShieldCheck className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="license"
                      name="license"
                      type="text"
                      required
                      onChange={handleLicenseChange}
                      className={`pl-10 focus:ring-emerald-500 focus:border-emerald-500 ${
                        licenseError ? "border-destructive" : ""
                      }`}
                      placeholder="AB123456"
                    />
                  </div>
                  {licenseError && (
                    <p className="text-sm text-destructive mt-1">
                      {licenseError}
                    </p>
                  )}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white group relative overflow-hidden"
                disabled={isLoading}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isLoading ? "Creating account..." : "Sign Up"}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or sign up with
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className="flex items-center justify-center border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition duration-200"
                  onClick={() => handleSocialSignIn("Google")}
                >
                  <Mail className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition duration-200"
                  onClick={() => handleSocialSignIn("Facebook")}
                >
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition duration-200"
                  onClick={() => handleSocialSignIn("Twitter")}
                >
                  <Twitter className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Already have an account?
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <Button
                  variant="outline"
                  className="w-full border-emerald-500 text-emerald-600 hover:bg-emerald-50 transition duration-200"
                  onClick={() => navigate("/signin")}
                >
                  Sign In
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Add floating animation keyframes */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }
      `}</style>
    </div>
  );
};

export default SignUp;
