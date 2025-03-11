import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Layout } from "@/components/Layout";
import {
  ChevronRight,
  Stethoscope,
  Calendar,
  MessageSquare,
  Users,
  UserCircle,
  ChevronLeft,
  Heart,
  Shield,
  CheckCircle2,
  Trophy,
  Sparkles,
  Bell,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Welcome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeTab, setActiveTab] = useState("tour");
  const featureCardRef = useRef(null);

  useEffect(() => {
    // If no user, redirect to signin
    if (!user) {
      setTimeout(() => {
        if (!user) {
          navigate("/signin");
        }
        setLoading(false);
      }, 500);
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    if (currentStep === 4) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [currentStep]);

  const features = [
    {
      title: "Find Doctors",
      description:
        "Search for healthcare providers by specialty, location, and ratings to find the perfect match for your needs",
      icon: <Stethoscope className="h-12 w-12 text-primary" />,
      color: "from-blue-500/20 to-blue-600/20",
      benefits: [
        "Access to 10,000+ specialists",
        "View verified credentials",
        "Read patient reviews",
      ],
    },
    {
      title: "Schedule Appointments",
      description:
        "Book and manage your healthcare appointments with ease through our intuitive calendar system",
      icon: <Calendar className="h-12 w-12 text-primary" />,
      color: "from-green-500/20 to-green-600/20",
      benefits: [
        "24/7 online booking",
        "Automated reminders",
        "Easy rescheduling",
      ],
    },
    {
      title: "Secure Messaging",
      description:
        "Communicate with your healthcare providers securely and get quick responses to your questions",
      icon: <MessageSquare className="h-12 w-12 text-primary" />,
      color: "from-purple-500/20 to-purple-600/20",
      benefits: [
        "End-to-end encryption",
        "File sharing capabilities",
        "Prescription requests",
      ],
    },
    {
      title: "Community",
      description:
        "Connect with other patients and healthcare professionals in moderated support groups",
      icon: <Users className="h-12 w-12 text-primary" />,
      color: "from-amber-500/20 to-amber-600/20",
      benefits: [
        "Join condition-specific groups",
        "Attend virtual events",
        "Access shared resources",
      ],
    },
  ];

  const quickStartTasks = [
    { title: "Complete your profile", completed: false },
    { title: "Add your medical history", completed: false },
    { title: "Connect with a doctor", completed: false },
    { title: "Set up notifications", completed: false },
  ];

  const handleNext = () => {
    if (currentStep < features.length) {
      setCurrentStep(currentStep + 1);

      // Add a little animation to the feature card
      if (featureCardRef.current) {
        featureCardRef.current.classList.add("scale-105");
        setTimeout(() => {
          featureCardRef.current.classList.remove("scale-105");
        }, 200);
      }
    } else {
      navigate("/dashboard");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  // Confetti effect component
  const Confetti = () => {
    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor:
                i % 5 === 0
                  ? "#3b82f6"
                  : i % 5 === 1
                  ? "#10b981"
                  : i % 5 === 2
                  ? "#8b5cf6"
                  : i % 5 === 3
                  ? "#f59e0b"
                  : "#ef4444",
              top: `${Math.random() * 20}%`,
              left: `${Math.random() * 100}%`,
            }}
            initial={{ y: -10, scale: 0 }}
            animate={{
              y: `${Math.random() * 100 + 100}vh`,
              scale: Math.random() * 2 + 1,
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="col-span-12 flex items-center justify-center min-h-[50vh]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-48 bg-slate-200 rounded mb-4"></div>
            <div className="h-4 w-64 bg-slate-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-accent/10 to-background flex items-center justify-center p-4">
      {showConfetti && <Confetti />}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Badge
              variant="outline"
              className="px-4 py-2 bg-background/80 backdrop-blur-sm shadow-md text-primary font-medium text-lg rounded-full"
            >
              <Heart className="w-5 h-5 mr-2 text-primary" /> Health Connect
            </Badge>
          </motion.div>
        </div>

        <Card className="shadow-2xl border-t-4 border-t-primary backdrop-blur-sm bg-card/95">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Welcome to Your Health Journey
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Your personal healthcare platform designed for your unique needs
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="pt-6">
            <motion.div
              className="flex flex-col items-center mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <Avatar className="h-32 w-32 mb-4 ring-4 ring-background shadow-lg relative">
                  <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/70 to-secondary/70 text-white">
                    {user?.name?.charAt(0) || (
                      <UserCircle className="h-16 w-16" />
                    )}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h2 className="text-3xl font-bold mt-2 flex items-center gap-2">
                Hello, {user?.name || "there"}!
                <motion.div
                  initial={{ rotate: -10, scale: 0.8 }}
                  animate={{ rotate: 10, scale: 1 }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 1,
                  }}
                >
                  <Sparkles className="h-6 w-6 text-yellow-400" />
                </motion.div>
              </h2>
              <p className="text-muted-foreground mt-1 flex items-center">
                <Shield className="h-4 w-4 mr-1 text-primary" />
                Your health information is secure with us
              </p>

              <div className="mt-4 flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Bell className="h-3 w-3" /> New Member
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Joined Today
                </Badge>
              </div>
            </motion.div>

            <Tabs
              defaultValue="tour"
              className="w-full"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
                <TabsTrigger value="tour">Feature Tour</TabsTrigger>
                <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
              </TabsList>

              <TabsContent value="tour" className="mt-0">
                <AnimatePresence mode="wait">
                  {currentStep < features.length ? (
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                      ref={featureCardRef}
                    >
                      <div
                        className={`flex flex-col md:flex-row md:items-stretch items-center text-center md:text-left p-6 md:p-8 rounded-xl bg-gradient-to-br ${features[currentStep].color} shadow-md transition-all duration-300 ease-in-out`}
                      >
                        <div className="md:w-1/3 flex justify-center">
                          <motion.div
                            initial={{ scale: 0.8, rotateY: 0 }}
                            animate={{
                              scale: 1,
                              rotateY: 360,
                            }}
                            transition={{
                              scale: {
                                duration: 0.5,
                                repeat: Infinity,
                                repeatType: "reverse",
                                repeatDelay: 2,
                              },
                              rotateY: {
                                duration: 1,
                                delay: 0.5,
                              },
                            }}
                            className="bg-background/30 backdrop-blur-sm p-6 rounded-full shadow-inner"
                          >
                            {features[currentStep].icon}
                          </motion.div>
                        </div>

                        <div className="md:w-2/3 md:pl-6 mt-4 md:mt-0">
                          <h3 className="text-2xl font-semibold">
                            {features[currentStep].title}
                          </h3>
                          <p className="text-muted-foreground mt-2 mb-4">
                            {features[currentStep].description}
                          </p>

                          <div className="space-y-2">
                            {features[currentStep].benefits.map(
                              (benefit, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center text-sm"
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                                  <span>{benefit}</span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-4">
                        <div className="w-full max-w-md flex items-center gap-2">
                          <span className="text-sm text-muted-foreground w-6 text-right">
                            {currentStep + 1}
                          </span>
                          <Progress
                            value={(currentStep + 1) * (100 / features.length)}
                            className="h-2 flex-1 bg-muted/50"
                          />
                          <span className="text-sm text-muted-foreground w-6">
                            {features.length}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: features.length }).map(
                            (_, index) => (
                              <motion.span
                                key={index}
                                className={`w-3 h-3 rounded-full cursor-pointer transition-colors duration-300 ${
                                  index === currentStep
                                    ? "bg-primary"
                                    : "bg-muted"
                                }`}
                                whileHover={{ scale: 1.2 }}
                                onClick={() => setCurrentStep(index)}
                              />
                            )
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="final-step"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="text-center space-y-6 py-8"
                    >
                      <div className="inline-flex p-6 rounded-full bg-primary/10 mb-2 relative">
                        <div className="absolute inset-0 rounded-full bg-primary/5 animate-ping opacity-75"></div>
                        <Trophy className="h-16 w-16 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold">You're all set!</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Thank you for joining Health Connect. We're excited to
                        support your healthcare journey with our comprehensive
                        platform.
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 max-w-2xl mx-auto">
                        {features.map((feature, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-lg bg-gradient-to-br ${feature.color} flex flex-col items-center text-center`}
                          >
                            {feature.icon.type({ className: "w-8 h-8 mb-2" })}
                            <span className="text-sm font-medium">
                              {feature.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>

              <TabsContent value="quickstart">
                <div className="space-y-6 py-4">
                  <h3 className="text-xl font-medium text-center">
                    Complete these tasks to get started
                  </h3>

                  <div className="space-y-3 max-w-md mx-auto">
                    {quickStartTasks.map((task, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer group"
                      >
                        <div className="flex-shrink-0 mr-3">
                          <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            {task.completed && (
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">{task.title}</p>
                        </div>
                        <div className="ml-auto">
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="text-center mt-6">
                    <p className="text-sm text-muted-foreground mb-4">
                      Complete these tasks to get the most out of Health Connect
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("tour")}
                    >
                      Return to Tour
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="flex justify-between pt-4 pb-6 px-6">
            {currentStep === 0 ? (
              <Button variant="ghost" onClick={handleSkip} className="gap-1">
                Skip tour
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="gap-1"
                disabled={currentStep === 0}
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="gap-1 px-6 relative overflow-hidden group"
              size={currentStep >= features.length ? "lg" : "default"}
            >
              <span className="relative z-10">
                {currentStep < features.length ? "Continue" : "Go to Dashboard"}
              </span>
              <ChevronRight className="h-4 w-4 relative z-10" />
              <div className="absolute top-0 left-0 w-0 h-full bg-white/10 group-hover:w-full transition-all duration-300 ease-in-out"></div>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Welcome;
