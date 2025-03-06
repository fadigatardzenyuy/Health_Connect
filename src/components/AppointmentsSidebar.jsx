import {
  Calendar,
  MapPin,
  Clock,
  VideoIcon,
  Phone,
  MessageSquare,
  Check,
  X,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export function AppointmentsSidebar() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [updates, setUpdates] = useState([
    {
      id: 1,
      title: "New Prescription Available",
      content: "Check your medication updates",
      type: "prescription",
    },
    {
      id: 2,
      title: "Health Monitoring Alert",
      content: "Review your latest vital signs",
      type: "monitoring",
    },
    {
      id: 3,
      title: "Virtual Checkup Reminder",
      content: "Complete your daily health questionnaire",
      type: "checkup",
    },
  ]);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      let query =
        user?.role === "doctor"
          ? supabase
              .from("appointments")
              .select("*, patient:patient_id(full_name)")
              .eq("doctor_id", user.id)
          : supabase
              .from("appointments")
              .select("*, doctor:doctor_id(full_name, specialization)")
              .eq("patient_id", user.id);

      const { data, error } = await query;
      if (error) throw error;

      console.log("Fetched appointments:", data);
      setAppointments(data || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast({
        title: "Error loading appointments",
        description:
          "Could not load your appointments. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleAppointmentAction = async (appointmentId, action) => {
    try {
      const status =
        action === "approve"
          ? "confirmed"
          : action === "decline"
          ? "declined"
          : "needs_rescheduling";

      const { error } = await supabase
        .from("appointments")
        .update({ status })
        .eq("id", appointmentId);

      if (error) throw error;

      toast({
        title: `Appointment ${action}ed`,
        description: `The appointment has been ${action}ed successfully.`,
      });

      // Refresh appointments after action
      fetchAppointments();
    } catch (error) {
      console.error(`Error ${action}ing appointment:`, error);
      toast({
        title: "Action Failed",
        description: `Could not ${action} the appointment. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleBookConsultation = () => {
    navigate("/consultation-booking");
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

  const getConsultationIcon = (type) => {
    switch (type) {
      case "video":
        return <VideoIcon className="w-5 h-5 text-primary" />;
      case "audio":
        return <Phone className="w-5 h-5 text-primary" />;
      case "message":
        return <MessageSquare className="w-5 h-5 text-primary" />;
      default:
        return <Calendar className="w-5 h-5 text-primary" />;
    }
  };

  const handleViewDetails = (appointmentId) => {
    navigate(`/appointment-details/${appointmentId}`);
  };

  return (
    <div className="space-y-6 sticky top-24">
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <Button className="w-full mb-4" onClick={handleBookConsultation}>
          Book Consultation
        </Button>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center justify-between">
            Upcoming Consultations
            <a
              href="#"
              className="text-sm text-primary hover:underline"
              onClick={() => navigate("/all-appointments")}
            >
              View all
            </a>
          </h2>

          {appointments.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No upcoming appointments
            </p>
          ) : (
            appointments.map((apt) => (
              <div key={apt.id} className="border-b pb-4 last:border-0">
                <div className="flex items-start gap-3">
                  <VideoIcon className="w-5 h-5 text-primary" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-medium truncate">
                        {user?.role === "doctor"
                          ? apt.patient?.full_name
                          : apt.doctor?.full_name}
                      </h3>
                      {getStatusBadge(apt.status)}
                    </div>

                    {apt.doctor?.specialization && (
                      <p className="text-sm text-muted-foreground">
                        {apt.doctor.specialization}
                      </p>
                    )}

                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <CalendarIcon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{apt.appointment_date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span className="truncate">{apt.appointment_time}</span>
                    </div>

                    <div className="mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7"
                        onClick={() => handleViewDetails(apt.id)}
                      >
                        View Details
                      </Button>
                    </div>

                    {user?.role === "doctor" && apt.status === "pending" && (
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                          onClick={() =>
                            handleAppointmentAction(apt.id, "approve")
                          }
                        >
                          <Check className="w-4 h-4" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                          onClick={() =>
                            handleAppointmentAction(apt.id, "decline")
                          }
                        >
                          <X className="w-4 h-4" /> Decline
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleAppointmentAction(apt.id, "reschedule")
                          }
                        >
                          Reschedule
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Health Updates</h2>
        <div className="space-y-4">
          {updates.map((update) => (
            <div key={update.id} className="border-b pb-4 last:border-0">
              <h3 className="font-medium text-primary truncate">
                {update.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2">
                {update.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
