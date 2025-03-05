import { User, Calendar, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { PatientDetail } from "./PatientDetail";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function AppointmentList() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        let query = supabase
          .from("appointments")
          .select(
            `
            *,
            doctor:doctor_id(full_name, specialization),
            patient:patient_id(full_name)
          `
          )
          .order("appointment_date", { ascending: true })
          .order("appointment_time", { ascending: true })
          .limit(5);

        if (user?.role === "doctor") {
          query = query.eq("doctor_id", user.id);
        } else {
          query = query.eq("patient_id", user.id);
        }

        const { data, error } = await query;

        if (error) throw error;
        setAppointments(data || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast({
          title: "Error",
          description: "Failed to load appointments",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchAppointments();
    }
  }, [user, toast]);

  const handleViewDetails = (id) => {
    toast({
      title: "Opening appointment details",
      description: `Viewing details for appointment #${id}`,
    });
  };

  const handleViewPatient = (patientId) => {
    setSelectedPatientId(patientId);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    // Small delay to prevent UI flash when closing
    setTimeout(() => setSelectedPatientId(null), 300);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-9 w-28" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Recent Appointments</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            toast({
              title: "View all appointments",
              description: "Opening full appointment schedule",
            })
          }
        >
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No appointments scheduled
            </p>
          ) : (
            appointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">
                        {user?.role === "doctor"
                          ? apt.patient?.full_name
                          : apt.doctor?.full_name}
                      </h4>
                      <Badge className={getStatusColor(apt.status)}>
                        {apt.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {apt.doctor?.specialization || "Consultation"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {format(new Date(apt.appointment_date), "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{apt.appointment_time}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog
                      open={
                        isDetailOpen && selectedPatientId === apt.patient_id
                      }
                      onOpenChange={(open) => {
                        if (!open) handleCloseDetail();
                        else setIsDetailOpen(open);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleViewPatient(apt.patient_id)}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl p-0">
                        <PatientDetail
                          patientId={selectedPatientId || undefined}
                          onClose={handleCloseDetail}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(apt.id)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
