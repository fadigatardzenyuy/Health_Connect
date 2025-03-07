import { Layout } from "@/components/Layout";
import { Sidebar } from "@/components/Sidebar";
import { MainFeed } from "@/components/MainFeed";
import { AppointmentsSidebar } from "@/components/AppointmentsSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRightFromLine } from "lucide-react";

import { PatientHealthSummary } from "@/components/patient/PatientHealthSummary";
import { AppointmentCalendar } from "../components/appointments/AppointmentCalender";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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

  // Show doctor dashboard switch button if user is a doctor
  const DoctorDashboardSwitch = user?.role === "doctor" && (
    <div className="mb-4 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-primary">
            Doctor Dashboard Available
          </h3>
          <p className="text-sm text-muted-foreground">
            Switch to your doctor dashboard for professional tools
          </p>
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={() => navigate("/doctor-dashboard")}
          className="gap-1"
        >
          Switch <ArrowRightFromLine className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

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
    <Layout>
      <div className="col-span-12 lg:col-span-3 xl:col-span-2">
        <Sidebar />
      </div>
      <div className="col-span-12 lg:col-span-6 xl:col-span-7 space-y-6">
        {DoctorDashboardSwitch}
        <MainFeed />

        {/* Calendar for appointment management */}
        <div className="mb-6">
          <AppointmentCalendar
            appointments={[]}
            userRole={user?.role}
            onDateSelect={(date) => {
              console.log("Selected date:", date);
            }}
          />
        </div>
      </div>
      <div className="col-span-12 lg:col-span-3 space-y-6">
        {/* Show different content based on user role */}
        {user?.role === "doctor" ? (
          <PatientHealthSummary />
        ) : (
          <AppointmentsSidebar userId={user?.id} />
        )}
      </div>
    </Layout>
  );
};

export default Index;
