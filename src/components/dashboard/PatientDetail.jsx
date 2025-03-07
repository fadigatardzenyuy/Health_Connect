import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, FileText, Mail, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { MedicalRecordsList } from "./MedicalRecordsList";
import { VitalSignsTracker } from "./VitalSignsTracker";

export function PatientDetail({ patientId, onClose }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    if (!patientId) return;

    const fetchPatientData = async () => {
      // In a real application, this would be an API call to your backend
      // Example: const { data, error } = await supabase.from('patients').select('*').eq('id', patientId).single();

      // Simulate API delay
      setTimeout(() => {
        // Mock data for demonstration
        setPatient({
          id: patientId,
          name: "John Doe",
          age: 42,
          gender: "Male",
          email: "john.doe@example.com",
          phone: "+1 (555) 123-4567",
          bloodType: "O+",
          allergies: ["Penicillin", "Peanuts"],
          lastVisit: "2023-07-15",
          upcomingAppointment: {
            date: "2023-08-10",
            time: "14:30",
          },
          medicalHistory: [
            {
              date: "2023-07-15",
              diagnosis: "Seasonal Allergies",
              doctor: "Dr. Smith",
              notes:
                "Patient presented with nasal congestion and itchy eyes. Prescribed antihistamines.",
            },
            {
              date: "2023-06-02",
              diagnosis: "Annual Checkup",
              doctor: "Dr. Johnson",
              notes:
                "All vitals normal. Recommended increased physical activity.",
            },
            {
              date: "2023-03-10",
              diagnosis: "Influenza",
              doctor: "Dr. Smith",
              notes:
                "Patient presented with fever, body aches, and fatigue. Prescribed oseltamivir and rest.",
            },
          ],
        });
        setLoading(false);
      }, 1000);
    };

    fetchPatientData();
  }, [patientId]);

  const handleScheduleAppointment = () => {
    toast({
      title: "Scheduling appointment",
      description: `Opening scheduler for ${patient?.name}`,
    });
  };

  const handleSendMessage = () => {
    toast({
      title: "Sending message",
      description: `Opening conversation with ${patient?.name}`,
    });
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div>
              <Skeleton className="h-5 w-48 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!patient) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Patient Not Found</CardTitle>
          <CardDescription>
            The requested patient information could not be found.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onClose}>Go Back</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  patient.name
                )}&background=random`}
              />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{patient.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{patient.gender}</Badge>
                <Badge variant="outline">{patient.age} years</Badge>
                <Badge>{patient.bloodType}</Badge>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{patient.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{patient.phone}</span>
            </div>
            {patient.allergies.length > 0 && (
              <div className="mt-2">
                <span className="text-sm font-medium">Allergies: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {patient.allergies.map((allergy) => (
                    <Badge key={allergy} variant="destructive">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Last Visit:</span>
              <span className="text-sm">{patient.lastVisit}</span>
            </div>
            {patient.upcomingAppointment && (
              <div className="space-y-1">
                <span className="text-sm font-medium">
                  Upcoming Appointment:
                </span>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span>{patient.upcomingAppointment.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span>{patient.upcomingAppointment.time}</span>
                  </div>
                </div>
              </div>
            )}
            <div className="flex gap-2 mt-2">
              <Button size="sm" onClick={handleScheduleAppointment}>
                Schedule Appointment
              </Button>
              <Button size="sm" variant="outline" onClick={handleSendMessage}>
                Send Message
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        <Tabs defaultValue="records">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="records">Medical Records</TabsTrigger>
            <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="records">
            <MedicalRecordsList patientId={patientId || ""} />
          </TabsContent>

          <TabsContent value="vitals">
            <VitalSignsTracker patientId={patientId || ""} />
          </TabsContent>

          <TabsContent value="notes">
            <Card>
              <CardContent className="p-4">
                <textarea
                  className="w-full min-h-[200px] p-3 border rounded-md resize-none"
                  placeholder="Add doctor's notes here..."
                />
                <div className="flex justify-end mt-2">
                  <Button
                    onClick={() => {
                      toast({
                        title: "Notes saved",
                        description:
                          "Patient notes have been successfully saved",
                      });
                    }}
                  >
                    Save Notes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
