import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Facebook, Twitter } from "lucide-react"; // Import relevant icons
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "patient";
  const [isLoading, setIsLoading] = useState(false);
  const [licenseError, setLicenseError] = useState("");

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
      {/* Right Section - Creative Information About Health Platform */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-r from-blue-600 to-purple-700 justify-center items-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src="../assets/image3.jpeg"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 text-center text-white">
          <h3 className="text-4xl font-bold mb-4 drop-shadow-lg">
            Welcome to Health Connect
          </h3>
          <p className="mb-4 text-lg drop-shadow-md">
            Your health is our priority. Join us and gain access to personalized
            health plans, expert consultations, and a supportive community.
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white bg-opacity-20 backdrop-blur-lg p-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h4 className="text-xl font-semibold">
                Personalized Health Plans
              </h4>
              <p>Tailored to fit your unique needs and goals.</p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-lg p-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h4 className="text-xl font-semibold">Expert Consultations</h4>
              <p>Access certified health professionals at any time.</p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-lg p-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h4 className="text-xl font-semibold">Community Support</h4>
              <p>A supportive network to help you on your journey.</p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-lg p-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h4 className="text-xl font-semibold">24/7 Health Resources</h4>
              <p>Always available to assist you with your health needs.</p>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="mt-6 border-t border-white pt-4">
            <h4 className="text-lg font-semibold">What Our Users Say</h4>
            <div className="italic">
              "Health Connect changed my life! I have never felt better!"
            </div>
            <div className="mt-2 font-medium">- Jane D.</div>
          </div>
        </div>
      </div>

      {/* Left Section - Sign Up Form */}
      <div className="flex items-center justify-center w-full md:w-1/2">
        <div className="w-full max-w-md px-6 lg:px-8">
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Create your account
          </h2>

          <div className="mt-4 bg-white py-6 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1"
                />
              </div>

              {role === "doctor" && (
                <div>
                  <Label htmlFor="license">Medical License Number</Label>
                  <Input
                    id="license"
                    name="license"
                    type="text"
                    required
                    onChange={handleLicenseChange}
                    className={`mt-1 ${
                      licenseError ? "border-destructive" : ""
                    }`}
                  />
                  {licenseError && (
                    <p className="text-sm text-destructive mt-1">
                      {licenseError}
                    </p>
                  )}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>

            <div className="mt-4">
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

              <div className="mt-2 flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="flex items-center justify-center w-full border border-blue-600 text-blue-600 hover:bg-blue-100 transition duration-200"
                  onClick={() => handleSocialSignIn("Google")}
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Sign in with Google
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center w-full border border-blue-600 text-blue-600 hover:bg-blue-100 transition duration-200"
                  onClick={() => handleSocialSignIn("Facebook")}
                >
                  <Facebook className="w-5 h-5 mr-2" />
                  Sign in with Facebook
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center w-full border border-blue-600 text-blue-600 hover:bg-blue-100 transition duration-200"
                  onClick={() => handleSocialSignIn("Twitter")}
                >
                  <Twitter className="w-5 h-5 mr-2" />
                  Sign in with Twitter
                </Button>
              </div>
            </div>

            <div className="mt-4">
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

              <div className="mt-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/signin")}
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
