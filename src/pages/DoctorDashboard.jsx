import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Users, Clock, Calendar, Activity, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AppointmentList } from "@/components/dashboard/AppointmentList";
import { PatientList } from "@/components/dashboard/PatientList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DoctorDashboard = () => {
  const { user, isDoctor, isVerifiedDoctor } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [doctorCode, setDoctorCode] = useState("");

  useEffect(() => {
    if (!isDoctor) {
      navigate("/dashboard");
      toast({
        title: "Access Denied",
        description: "Only doctors can access this dashboard.",
        variant: "destructive",
      });
    }
  }, [isDoctor, navigate, toast]);

  const handleVerifyCode = () => {
    // Add verification logic here
    toast({
      title: "Verification in Progress",
      description: "Your doctor code is being verified...",
    });
  };

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

  if (!isVerifiedDoctor) {
    return (
      <Layout>
        <div className="col-span-12">
          <Card className="w-full max-w-md mx-auto mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                Doctor Verification Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Please enter your doctor verification code to access the
                dashboard.
              </p>
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter your doctor code"
                  value={doctorCode}
                  onChange={(e) => setDoctorCode(e.target.value)}
                />
                <Button className="w-full" onClick={handleVerifyCode}>
                  Verify Code
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="col-span-12">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-primary">
              Doctor Dashboard
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              Verified Doctor
            </span>
          </div>
          <p className="text-muted-foreground">Welcome back, {user?.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
            />
          ))}
        </div>

        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <AppointmentList />
          </TabsContent>

          <TabsContent value="patients">
            <PatientList />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DoctorDashboard;
