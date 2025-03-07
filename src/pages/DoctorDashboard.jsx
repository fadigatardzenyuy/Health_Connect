import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Users, Clock, Calendar, Activity, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AppointmentList } from "@/components/dashboard/AppointmentList";
import { PatientList } from "@/components/dashboard/PatientList";
import { DoctorVerification } from "@/components/doctor/DoctorVerification";
import { PerformanceMetrics } from "@/components/dashboard/PerformanceMetrics";
import { UpcomingConsultations } from "@/components/dashboard/UpcomingConsultations";
import { PatientSummary } from "@/components/dashboard/PatientSummary";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

const DoctorDashboard = () => {
  const { user, isDoctor, isVerifiedDoctor } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    totalPatients: 0,
    upcomingAppointments: 0,
    todayConsultations: 0,
    activeCases: 0,
  });

  useEffect(() => {
    console.log(
      "Dashboard mount - User role:",
      user?.role,
      "isDoctor:",
      isDoctor,
      "isVerified:",
      user?.isVerified
    );

    // Short timeout to ensure auth state is loaded
    const timer = setTimeout(() => {
      setIsLoading(false);

      if (!user) {
        navigate("/signin");
        return;
      }

      if (!isDoctor) {
        navigate("/dashboard");
        toast({
          title: "Access Denied",
          description: "Only doctors can access this dashboard.",
          variant: "destructive",
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isDoctor, user, navigate, toast]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!user?.id) return;

      try {
        // Fetch total unique patients (without using distinctOn)
        let { data: patientsData, error: patientsError } = await supabase
          .from("appointments")
          .select("patient_id")
          .eq("doctor_id", user.id);

        if (patientsError) throw patientsError;

        // Get unique patient IDs
        const uniquePatientIds = [
          ...new Set(patientsData?.map((record) => record.patient_id) || []),
        ];
        const patientsCount = uniquePatientIds.length;

        // Fetch upcoming appointments
        const today = new Date().toISOString().split("T")[0];
        const { count: upcomingCount, error: upcomingError } = await supabase
          .from("appointments")
          .select("id", { count: "exact", head: true })
          .eq("doctor_id", user.id)
          .gte("appointment_date", today)
          .not("status", "eq", "cancelled");

        if (upcomingError) throw upcomingError;

        // Fetch today's consultations
        const { count: todayCount, error: todayError } = await supabase
          .from("appointments")
          .select("id", { count: "exact", head: true })
          .eq("doctor_id", user.id)
          .eq("appointment_date", today)
          .not("status", "eq", "cancelled");

        if (todayError) throw todayError;

        // Active cases - patients with recent appointments within last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split("T")[0];

        // Get active cases without using distinctOn
        let { data: activeCasesData, error: activeCasesError } = await supabase
          .from("appointments")
          .select("patient_id")
          .eq("doctor_id", user.id)
          .gte("appointment_date", thirtyDaysAgoStr);

        if (activeCasesError) throw activeCasesError;

        // Get unique active patient IDs
        const uniqueActivePatientIds = [
          ...new Set(activeCasesData?.map((record) => record.patient_id) || []),
        ];
        const activeCasesCount = uniqueActivePatientIds.length;

        setStats({
          totalPatients: patientsCount || 0,
          upcomingAppointments: upcomingCount || 0,
          todayConsultations: todayCount || 0,
          activeCases: activeCasesCount || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        toast({
          title: "Failed to load dashboard stats",
          description: "There was an error loading your dashboard statistics",
          variant: "destructive",
        });
      }
    };

    if (user?.id && isVerifiedDoctor) {
      fetchDashboardStats();
    }
  }, [user?.id, isVerifiedDoctor, toast]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Searching",
        description: `Searching for "${searchQuery}"`,
      });
    }
  };

  if (isLoading) {
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

  if (!isVerifiedDoctor) {
    return (
      <Layout>
        <div className="col-span-12">
          <h1 className="text-3xl font-bold text-primary mb-6">
            Doctor Dashboard
          </h1>
          <DoctorVerification
            onVerificationSuccess={() => {
              // Refresh the page to show the verified dashboard
              window.location.reload();
            }}
          />
        </div>
      </Layout>
    );
  }

  const dashboardStats = [
    {
      title: "Total Patients",
      value: stats.totalPatients.toString(),
      icon: Users,
    },
    {
      title: "Upcoming Appointments",
      value: stats.upcomingAppointments.toString(),
      icon: Clock,
    },
    {
      title: "Today's Consultations",
      value: stats.todayConsultations.toString(),
      icon: Calendar,
    },
    {
      title: "Active Cases",
      value: stats.activeCases.toString(),
      icon: Activity,
    },
  ];

  return (
    <Layout>
      <div className="col-span-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-primary">
                Doctor Dashboard
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                Verified Doctor
              </span>
            </div>
            <p className="text-muted-foreground">
              Welcome back, Dr. {user?.name}
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search patients..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </div>

        <Tabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {dashboardStats.map((stat) => (
                <StatsCard
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PerformanceMetrics />
              </div>
              <div>
                <PatientSummary />
              </div>
            </div>

            <UpcomingConsultations />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PatientList />
              <AppointmentList />
            </div>
          </TabsContent>

          <TabsContent value="patients">
            <PatientList />
          </TabsContent>

          <TabsContent value="appointments">
            <AppointmentList />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PerformanceMetrics />
              <PatientSummary />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DoctorDashboard;
