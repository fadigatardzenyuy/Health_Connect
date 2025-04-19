import { Layout } from "@/components/Layout";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PatientHealthSummary } from "@/components/patient/PatientHealthSummary";
import { MainFeed } from "@/components/MainFeed";
import { useToast } from "@/hooks/use-toast";
import HospitalAdminDashboard from "./HospitalAdminDashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, AlertCircle, Bell, Calendar } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState([
    "Heavy rainfall warning for Bamenda - Be careful on roads to hospitals",
    "COVID-19 vaccination available at Bamenda Regional Hospital",
  ]);

  useEffect(() => {
    // Verify user is authenticated
    const checkAuth = async () => {
      if (!user) {
        // Short timeout to ensure auth state is checked
        setTimeout(() => {
          if (!user) {
            navigate("/signin");
          }
          setLoading(false);
        }, 500);
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [user, navigate]);

  // Redirect users if they haven't completed onboarding
  useEffect(() => {
    if (user && !loading) {
      // Check if new patient needs to be onboarded
      const hasCompletedOnboarding = localStorage.getItem(
        "patientOnboardingComplete"
      );
      // if (user.role === "patient" && !hasCompletedOnboarding) {
      //   navigate("/welcome");
      //   return;
      // }

      // Check if hospital admin needs to complete setup
      if (user.role === "hospital_admin") {
        const hasCompletedSetup = localStorage.getItem("onboardingComplete");
        if (!hasCompletedSetup) {
          toast({
            title: "Complete Hospital Setup",
            description: "Please complete your hospital profile setup first.",
          });
          navigate("/onboarding");
          return;
        }
      }
    }
  }, [user, loading, navigate, toast]);

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

  // Check if user is a hospital admin
  const isHospitalAdmin = user?.role === "hospital_admin";

  // Render hospital admin dashboard if user is admin
  if (isHospitalAdmin) {
    return (
      <Layout>
        <div className="col-span-12">
          <HospitalAdminDashboard />
        </div>
      </Layout>
    );
  }

  // Regular patient dashboard
  return (
    <Layout>
      <div className="col-span-12 lg:col-span-3 xl:col-span-2">
        <Sidebar />
      </div>
      <div className="col-span-12 lg:col-span-6 xl:col-span-7">
        {emergencyAlerts.length > 0 && (
          <Card className="mb-4 border-amber-300 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="font-medium text-amber-800">Local Alerts</h3>
                  {emergencyAlerts.map((alert, i) => (
                    <p key={i} className="text-sm text-amber-700">
                      {alert}
                    </p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        <MainFeed />
      </div>
      <div className="col-span-12 lg:col-span-3 space-y-6">
        <PatientHealthSummary />

        <Card>
          <CardContent className="p-4 space-y-2">
            <h3 className="font-medium flex items-center">
              <Bell className="h-4 w-4 mr-2 text-primary" />
              Local Health Events
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center pb-2 border-b">
                <span>Free Malaria Testing</span>
                <span className="text-xs text-gray-500 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Apr 15
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span>Maternal Health Workshop</span>
                <span className="text-xs text-gray-500 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Apr 20
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Community Health Fair</span>
                <span className="text-xs text-gray-500 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  May 5
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
