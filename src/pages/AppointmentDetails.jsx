import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Calendar,
  Clock,
  Video,
  ArrowLeft,
  FileText,
  MessageSquare,
  HeartPulse,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";
import { MedicalRecordsList } from "@/components/dashboard/MedicalRecordsList";
import { VitalSignsTracker } from "@/components/dashboard/VitalSignsTracker";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        if (!id) return;

        const { data, error } = await supabase
          .from("appointments")
          .select(
            `
            *,
            patient:patient_id(full_name, avatar_url),
            doctor:doctor_id(full_name, specialization, avatar_url)
          `
          )
          .eq("id", id)
          .single();

        if (error) throw error;
        setAppointment(data);
      } catch (error) {
        console.error("Error fetching appointment details:", error);
        toast({
          title: "Error",
          description: "Failed to load appointment details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [id, toast]);

  const handleAppointmentAction = async (action) => {
    try {
      if (!appointment) return;

      const status =
        action === "approve"
          ? "confirmed"
          : action === "decline"
          ? "declined"
          : "needs_rescheduling";

      const { error } = await supabase
        .from("appointments")
        .update({ status })
        .eq("id", appointment.id);

      if (error) throw error;

      toast({
        title: `Appointment ${action}ed`,
        description: `The appointment has been ${action}ed successfully.`,
      });

      // Update local state
      setAppointment((prev) => (prev ? { ...prev, status } : null));
    } catch (error) {
      console.error(`Error ${action}ing appointment:`, error);
      toast({
        title: "Action Failed",
        description: `Could not ${action} the appointment. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const startConsultation = () => {
    navigate(`/video-consultation/${id}`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 hover:bg-green-200"
          >
            Confirmed
          </Badge>
        );
      case "declined":
        return <Badge variant="destructive">Declined</Badge>;
      case "needs_rescheduling":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
          >
            Needs Rescheduling
          </Badge>
        );
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="col-span-12 space-y-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-8 w-64" />
          </div>

          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!appointment) {
    return (
      <Layout>
        <div className="col-span-12">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-bold mb-2">Appointment Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The appointment you're looking for doesn't exist or has been
                removed.
              </p>
              <Button onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const isDoctor = user?.role === "doctor";
  const isPatient = user?.role === "patient";
  const otherParty = isDoctor ? appointment.patient : appointment.doctor;

  return (
    <Layout>
      <div className="col-span-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold">
              Appointment Details
            </h1>
          </div>

          {appointment.status === "confirmed" && (
            <Button onClick={startConsultation} className="gap-2">
              <Video className="h-4 w-4" />
              Start Consultation
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Information</CardTitle>
                <CardDescription>
                  Details about the scheduled consultation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Status
                  </span>
                  {getStatusBadge(appointment.status)}
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {format(new Date(appointment.appointment_date), "PPP")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {appointment.appointment_time}
                  </span>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-2">
                    {isDoctor ? "Patient" : "Doctor"}
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {otherParty?.avatar_url ? (
                        <img
                          src={otherParty.avatar_url}
                          alt={otherParty.full_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-primary font-medium">
                          {otherParty?.full_name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{otherParty?.full_name}</p>
                      {isPatient && appointment.doctor?.specialization && (
                        <p className="text-sm text-muted-foreground">
                          {appointment.doctor.specialization}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {isDoctor && appointment.status === "pending" && (
                  <div className="flex flex-col gap-2 mt-4">
                    <Button
                      className="w-full"
                      onClick={() => handleAppointmentAction("approve")}
                    >
                      <Check className="h-4 w-4 mr-2" /> Approve Appointment
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleAppointmentAction("decline")}
                    >
                      <X className="h-4 w-4 mr-2" /> Decline Appointment
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleAppointmentAction("reschedule")}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" /> Request
                      Reschedule
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" /> Message Patient
                </Button>
                {isDoctor && (
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" /> Add Medical Record
                  </Button>
                )}
                {isDoctor && (
                  <Button variant="outline" className="w-full justify-start">
                    <HeartPulse className="h-4 w-4 mr-2" /> Record Vital Signs
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Consultation Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Symptoms</h3>
                  <p className="text-sm">
                    {appointment.symptoms || "No symptoms provided"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-1">Medical History</h3>
                  <p className="text-sm">
                    {appointment.medical_history ||
                      "No medical history provided"}
                  </p>
                </div>

                {appointment.allergies && (
                  <div>
                    <h3 className="text-sm font-medium mb-1">Allergies</h3>
                    <p className="text-sm">{appointment.allergies}</p>
                  </div>
                )}

                {appointment.current_medications && (
                  <div>
                    <h3 className="text-sm font-medium mb-1">
                      Current Medications
                    </h3>
                    <p className="text-sm">{appointment.current_medications}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {isDoctor && (
              <Tabs defaultValue="medicalRecords">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="medicalRecords">
                    Medical Records
                  </TabsTrigger>
                  <TabsTrigger value="vitalSigns">Vital Signs</TabsTrigger>
                </TabsList>

                <TabsContent value="medicalRecords">
                  <MedicalRecordsList patientId={appointment.patient_id} />
                </TabsContent>

                <TabsContent value="vitalSigns">
                  <VitalSignsTracker patientId={appointment.patient_id} />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AppointmentDetails;
