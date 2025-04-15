import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Activity,
  Building,
  Calendar,
  CreditCard,
  MessageSquare,
  PieChart,
  Settings2,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { AdminLayout } from "@/components/hospital-admin/AdminLayout";

export default function HospitalAdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify user is authenticated and has hospital_admin role
    const checkAuth = async () => {
      if (!user) {
        // Short timeout to ensure auth state is checked
        setTimeout(() => {
          if (!user) {
            navigate("/signin");
          } else {
            setLoading(false);
          }
        }, 500);
      } else if (user.role !== "hospital_admin") {
        // Redirect non-admin users to patient dashboard
        toast({
          title: "Access Denied",
          description:
            "You don't have permission to view the hospital admin dashboard.",
          variant: "destructive",
        });
        navigate("/dashboard");
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [user, navigate, toast]);

  // For demo purposes: redirect to onboarding if coming directly to dashboard
  useEffect(() => {
    if (!loading && user?.role === "hospital_admin") {
      const hasCompletedOnboarding = localStorage.getItem("onboardingComplete");
      if (!hasCompletedOnboarding) {
        toast({
          title: "Onboarding Required",
          description: "Please complete the hospital setup process first.",
        });
        navigate("/onboarding");
      }
    }
  }, [loading, user, navigate, toast]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-48 bg-slate-200 rounded mb-4"></div>
            <div className="h-4 w-64 bg-slate-200 rounded"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <HospitalAdmin />
    </AdminLayout>
  );
}
