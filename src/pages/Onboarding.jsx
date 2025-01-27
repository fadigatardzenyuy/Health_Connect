import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-primary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-4xl font-bold text-primary">Welcome to Cameroon Health Connect</h1>
          <p className="text-xl text-gray-600">
            Your trusted platform for accessing quality healthcare services in Cameroon
          </p>
          
          <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">For Patients</h3>
              <p className="text-gray-600 mb-4">
                Connect with healthcare providers, book consultations, and manage your health journey
              </p>
              <Button onClick={() => navigate("/signup")} className="w-full">
                Sign Up as Patient
              </Button>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">For Healthcare Providers</h3>
              <p className="text-gray-600 mb-4">
                Join our network of healthcare professionals and connect with patients
              </p>
              <Button onClick={() => navigate("/signup")} variant="outline" className="w-full">
                Join as Healthcare Provider
              </Button>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-gray-600 mb-4">Already have an account?</p>
            <Button variant="ghost" onClick={() => navigate("/signin")}>
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;