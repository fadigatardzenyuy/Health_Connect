import { User, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { PatientDetail } from "./PatientDetail";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export function PatientList() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);

        if (!user?.id) return;

        if (user?.role === "doctor") {
          const { data: appointmentsData, error: appointmentsError } =
            await supabase
              .from("appointments")
              .select(
                `
              patient_id,
              appointment_date,
              status,
              patient:profiles!patient_id(id, full_name, email)
            `
              )
              .eq("doctor_id", user.id)
              .order("appointment_date", { ascending: false });

          if (appointmentsError) throw appointmentsError;

          const processedPatients = {};

          appointmentsData?.forEach((appointment) => {
            const patientId = appointment.patient_id;
            const patientInfo = appointment.patient;

            if (!processedPatients[patientId] && patientInfo) {
              processedPatients[patientId] = {
                id: patientId,
                name: patientInfo.full_name,
                full_name: patientInfo.full_name,
                email: patientInfo.email,
                lastVisit: appointment.appointment_date,
                status:
                  appointment.status === "completed"
                    ? "Past Patient"
                    : appointment.status === "confirmed"
                    ? "Upcoming"
                    : appointment.status === "pending"
                    ? "New"
                    : "Unknown",
              };
            }
          });

          setPatients(Object.values(processedPatients));
        } else {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("role", "patient")
            .limit(10);

          if (error) throw error;

          const formattedPatients = data.map((patient) => ({
            id: patient.id,
            name: patient.full_name,
            full_name: patient.full_name,
            email: patient.email,
            lastVisit: "Unknown",
            status: "Registered",
          }));

          setPatients(formattedPatients);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast({
          title: "Error",
          description: "Failed to load patient data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [toast, user]);

  const handleViewPatient = (id) => {
    setSelectedPatientId(id);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setTimeout(() => setSelectedPatientId(null), 300);
  };

  const patientListContent = (
    <div className="space-y-4">
      {loading ? (
        Array(3)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-9 w-24" />
            </div>
          ))
      ) : patients.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">
          No patients found
        </p>
      ) : (
        patients.map((patient) => (
          <div
            key={patient.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/10 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium truncate max-w-[180px] md:max-w-xs">
                  {patient.name}
                </h4>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground truncate max-w-[150px] md:max-w-xs">
                    {patient.lastVisit
                      ? `Last visit: ${patient.lastVisit}`
                      : "No visits recorded"}
                  </p>
                  {patient.status && (
                    <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                      {patient.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {isMobile ? (
              <Sheet
                open={isDetailOpen && selectedPatientId === patient.id}
                onOpenChange={(open) => {
                  if (!open) handleCloseDetail();
                  else setIsDetailOpen(open);
                }}
              >
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewPatient(patient.id)}
                  >
                    View Details
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-md p-0">
                  <PatientDetail
                    patientId={selectedPatientId || undefined}
                    onClose={handleCloseDetail}
                  />
                </SheetContent>
              </Sheet>
            ) : (
              <Dialog
                open={isDetailOpen && selectedPatientId === patient.id}
                onOpenChange={(open) => {
                  if (!open) handleCloseDetail();
                  else setIsDetailOpen(open);
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewPatient(patient.id)}
                  >
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl p-0">
                  <PatientDetail
                    patientId={selectedPatientId || undefined}
                    onClose={handleCloseDetail}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        ))
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Recent Patients</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            toast({
              title: "View all patients",
              description: "Opening full patient directory",
            })
          }
        >
          View All
        </Button>
      </CardHeader>
      <CardContent>{patientListContent}</CardContent>
    </Card>
  );
}
