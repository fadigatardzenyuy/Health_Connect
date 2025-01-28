import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Facebook, Twitter } from "lucide-react"; // Import relevant icons

const SignIn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Coming Soon",
      description: "Sign in functionality will be available soon!",
    });

    setTimeout(() => {
      navigate("/dashboard"); // Redirect to the dashboard
    }, 1000);
  };

  const handleSocialSignIn = (provider) => {
    toast({
      title: "Coming Soon",
      description: `Sign in with ${provider} functionality will be available soon!`,
    });

    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left Section - Sign In Form */}
      <div className="flex items-center justify-center w-full md:w-1/2">
        <div className="w-full max-w-md px-6 lg:px-8">
          <h2 className="text-center text-4xl font-bold text-gray-800 mb-4">
            Sign in to your account
          </h2>

          <div className="mt-4 bg-white py-6 px-4 shadow-lg rounded-lg ">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-700">
                  Email address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 w-full p-3 border border-gray-300 rounded-md transition duration-200 focus:border-blue-500 focus:ring focus:ring-blue-200"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 w-full p-3 border border-gray-300 rounded-md transition duration-200 focus:border-blue-500 focus:ring focus:ring-blue-200"
                  placeholder="Your password"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Button
                    variant="link"
                    className="font-medium text-blue-600 hover:text-blue-500 transition duration-200"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot your password?
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 transition duration-200"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-4 flex items-center justify-between">
              <div className="relative flex-grow border-t border-gray-300"></div>
              <span className="mx-3 text-gray-500">or</span>
              <div className="relative flex-grow border-t border-gray-300"></div>
            </div>

            <div className="mt-2 flex flex-col gap-2">
              <Button
                variant="outline"
                className="flex items-center justify-center w-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-200"
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
                className="flex items-center justify-center w-full border border-blue-400 text-blue-400 hover:bg-blue-100 transition duration-200"
                onClick={() => handleSocialSignIn("X")}
              >
                <Twitter className="w-5 h-5 mr-2" />
                Sign in with X
              </Button>
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
                  className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-200"
                  onClick={() => navigate("/signup")}
                >
                  Create an account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Creative Information About Health Platform */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-r from-blue-600 to-purple-700 justify-center items-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src="/path/to/health-background.jpg"
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

          <img
            src="/path/to/your/image.jpg" // Replace with your image path
            alt="Health Platform"
            className="mt-4 rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
