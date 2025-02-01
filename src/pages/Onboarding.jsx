import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { RiskAssessment } from "@/components/AIFeatures/PredictiveAnalytics/RiskAssessment";
import { OutbreakDetection } from "@/components/AIFeatures/PredictiveAnalytics/OutbreakDetection";

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome to Cameroon Health Connect
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
              Your trusted platform for accessing quality healthcare services in
              Cameroon. Connect with healthcare providers and manage your health
              journey seamlessly.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-3xl mx-auto mb-12">
            <div className="group relative transition-transform duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl -z-10" />
              <div className="p-8 bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-primary/20">
                <h3 className="text-3xl font-semibold text-primary mb-4">
                  For Patients
                </h3>
                <ul className="space-y-3 text-gray-700 mb-6">
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-primary rounded-full mr-2" />
                    Book consultations online
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-primary rounded-full mr-2" />
                    Access medical records
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-primary rounded-full mr-2" />
                    Chat with healthcare providers
                  </li>
                </ul>
                <Button
                  onClick={() => navigate("/signup")}
                  className="w-full bg-primary hover:bg-primary/90 transition duration-200"
                >
                  Sign Up as Patient
                </Button>
              </div>
            </div>

            <div className="group relative transition-transform duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-2xl -z-10" />
              <div className="p-8 bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-secondary/20">
                <h3 className="text-3xl font-semibold text-secondary mb-4">
                  For Healthcare Providers
                </h3>
                <ul className="space-y-3 text-gray-700 mb-6">
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-secondary rounded-full mr-2" />
                    Manage patient appointments
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-secondary rounded-full mr-2" />
                    Access patient records securely
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-secondary rounded-full mr-2" />
                    Collaborate with other providers
                  </li>
                </ul>
                <Button
                  onClick={() => navigate("/signup")}
                  variant="outline"
                  className="w-full border-secondary text-secondary hover:bg-secondary hover:text-white transition duration-200"
                >
                  Join as Healthcare Provider
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-3xl mx-auto mb-12">
            <RiskAssessment />
            <OutbreakDetection />
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-4">Already have an account?</p>
            <Button
              variant="ghost"
              onClick={() => navigate("/signin")}
              className="text-primary hover:text-primary/90 hover:bg-primary/10 transition duration-200"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
