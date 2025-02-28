import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Users,
  Clock,
  Calendar,
  Activity,
  Shield,
  Mail,
  Unlock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StatsCard } from "../components/dashboard/StatsCard";
import { AppointmentList } from "@/components/dashboard/AppointmentList";
import { PatientList } from "@/components/dashboard/PatientList";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const verificationCodeSchema = z.object({
  verificationCode: z.string().length(6, {
    message: "Verification code must be 6 digits",
  }),
});

const DoctorDashboard = () => {
  const {
    user,
    isDoctor,
    isVerifiedDoctor,
    checkVerificationCode,
    resetDoctorCode,
  } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRequestingCode, setIsRequestingCode] = useState(false);

  const codeForm = useForm({
    resolver: zodResolver(verificationCodeSchema),
    defaultValues: {
      verificationCode: "",
    },
  });

  useEffect(() => {
    console.log(
      "Dashboard mount - User role:",
      user?.role,
      "isDoctor:",
      isDoctor
    );
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
  }, [isDoctor, user, navigate, toast]);

  const handleVerificationCodeSubmit = async (values) => {
    try {
      setIsVerifying(true);
      await checkVerificationCode(values.verificationCode);
    } catch (error) {
      console.error("Error verifying code:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResetCode = async () => {
    try {
      setIsRequestingCode(true);
      if (user?.email) {
        await resetDoctorCode(user.email);
      }
    } catch (error) {
      console.error("Error resetting code:", error);
    } finally {
      setIsRequestingCode(false);
    }
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
              <CardDescription>
                Please enter your verification code to access the doctor
                dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Form {...codeForm}>
                <form
                  onSubmit={codeForm.handleSubmit(handleVerificationCodeSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={codeForm.control}
                    name="verificationCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter 6-digit code"
                            maxLength={6}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            onChange={(e) => {
                              const value = e.target.value.replace(
                                /[^0-9]/g,
                                ""
                              );
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the 6-digit code provided during signup
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col space-y-2">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isVerifying}
                    >
                      {isVerifying ? (
                        <span className="flex items-center gap-2">
                          <Unlock className="animate-pulse h-4 w-4" />
                          Verifying...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Unlock className="h-4 w-4" />
                          Verify Code
                        </span>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleResetCode}
                      disabled={isRequestingCode}
                    >
                      {isRequestingCode ? "Requesting..." : "Request New Code"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <p className="text-xs text-muted-foreground text-center">
                If you've lost your verification code, you can request a new
                one.
              </p>
            </CardFooter>
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
          <p className="text-muted-foreground">
            Welcome back, Dr. {user?.name}
          </p>
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
