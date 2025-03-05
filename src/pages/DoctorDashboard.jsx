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

const DoctorDashboard = () => {
  const { user, isDoctor, isVerifiedDoctor } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    console.log(
      "Dashboard mount - User role:",
      user?.role,
      "isDoctor:",
      isDoctor,
      "isVerified:",
      user?.isVerified
    );

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

  const stats = [
    {
      title: "Total Patients",
      value: "2,420",
      icon: Users,
    },
    {
      title: "Upcoming Appointments",
      value: "15",
      icon: Clock,
    },
    {
      title: "Today's Consultations",
      value: "8",
      icon: Calendar,
    },
    {
      title: "Active Cases",
      value: "48",
      icon: Activity,
    },
  ];

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
              window.location.reload();
            }}
          />
        </div>
      </Layout>
    );
  }

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
              {stats.map((stat) => (
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
