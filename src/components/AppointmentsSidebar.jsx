import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  User,
  Calendar,
  Clock,
  Phone,
  Video,
  Bell,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "./ui/skeleton";
import { useNavigate } from "react-router-dom";
import { format, isToday, isPast } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export function AppointmentsSidebar({ userId }) {
  const [appointments, setAppointments] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!userId && !user?.id) return;

      const id = userId || user?.id;
      const role = user?.role || "patient";

      try {
        setLoading(true);

        let query = supabase
          .from("appointments")
          .select(
            `
            id,
            appointment_date,
            appointment_time,
            status,
            doctor_id,
            patient_id,
            updated_at,
            doctor:profiles!doctor_id(full_name, specialization),
            patient:profiles!patient_id(full_name)
          `
          )
          .order("appointment_date", { ascending: true })
          .limit(5);

        if (role === "doctor") {
          query = query.eq("doctor_id", id);
        } else {
          query = query.eq("patient_id", id);
        }

        const today = new Date().toISOString().split("T")[0];
        query = query.gte("appointment_date", today);

        const { data, error } = await query;

        if (error) throw error;

        const processedData =
          data?.map((item) => ({
            ...item,
            doctor: item.doctor,
            patient: item.patient,
          })) || [];

        setAppointments(processedData);

        const appointmentUpdates = processedData.map((apt) => ({
          id: `update-${apt.id}`,
          message: `Appointment with ${
            role === "doctor" ? apt.patient?.full_name : apt.doctor?.full_name
          } is ${apt.status}`,
          type: "appointment",
          timestamp: apt.updated_at,
          isRead: false,
        }));

        const systemUpdates = [
          {
            id: "system-1",
            message: "New feature: Video consultations now available!",
            type: "system",
            timestamp: new Date().toISOString(),
            isRead: false,
          },
          {
            id: "system-2",
            message: "Remember to update your medical profile for better care",
            type: "notification",
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            isRead: true,
          },
        ];

        const allUpdates = [...appointmentUpdates, ...systemUpdates]
          .sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
          .slice(0, 5);

        setUpdates(allUpdates);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [userId, user]);

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            {status}
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-800 hover:bg-yellow-100"
          >
            {status}
          </Badge>
        );
      case "cancelled":
        return <Badge variant="destructive">{status}</Badge>;
      case "completed":
        return <Badge variant="secondary">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getUpdateIcon = (type) => {
    switch (type) {
      case "appointment":
        return <Calendar className="h-4 w-4 text-primary" />;
      case "notification":
        return <Bell className="h-4 w-4 text-amber-500" />;
      case "system":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
  };

  const handleViewAll = () => {
    navigate("/appointments");
  };

  const handleViewAppointment = (id) => {
    navigate(`/appointment-details/${id}`);
  };

  const handleStartConsultation = (id, isVideo) => {
    if (isVideo) {
      navigate(`/video-consultation/${id}`);
    } else {
      navigate(`/audio-consultation/${id}`);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Upcoming Appointments</CardTitle>
        <Button variant="outline" size="sm" onClick={handleViewAll}>
          View All
        </Button>
      </CardHeader>
      <CardContent className="px-3">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col gap-2 p-3 border rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-3 w-20" />
                <div className="flex items-center justify-between mt-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No upcoming appointments</p>
            <Button
              variant="default"
              size="sm"
              className="mt-4"
              onClick={() => navigate("/consultation-booking")}
            >
              Book Consultation
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((appointment) => {
              const appointmentDate = new Date(
                `${appointment.appointment_date}T${appointment.appointment_time}`
              );
              const showJoinButton =
                isToday(appointmentDate) && !isPast(appointmentDate);
              const isDoctor = user?.role === "doctor";

              const isVideoConsultation =
                appointment.id.charCodeAt(0) % 2 === 0;

              return (
                <div
                  key={appointment.id}
                  className="p-3 border rounded-lg hover:bg-muted/5 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">
                        {isDoctor
                          ? appointment.patient?.full_name
                          : appointment.doctor?.full_name}
                      </span>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>

                  <p className="text-xs text-muted-foreground mb-2">
                    {isDoctor
                      ? "Patient Consultation"
                      : appointment.doctor?.specialization ||
                        "Medical Consultation"}
                  </p>

                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {format(
                          new Date(appointment.appointment_date),
                          "MMM d, yyyy"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{appointment.appointment_time}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {isVideoConsultation ? (
                        <>
                          <Video className="h-3 w-3 text-primary" />
                          <span className="text-xs">Video</span>
                        </>
                      ) : (
                        <>
                          <Phone className="h-3 w-3 text-primary" />
                          <span className="text-xs">Audio</span>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 px-2"
                        onClick={() => handleViewAppointment(appointment.id)}
                      >
                        Details
                      </Button>

                      {showJoinButton && appointment.status === "confirmed" && (
                        <Button
                          size="sm"
                          className="text-xs h-7 px-2"
                          onClick={() =>
                            handleStartConsultation(
                              appointment.id,
                              isVideoConsultation
                            )
                          }
                        >
                          Join
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            <Separator className="my-2" />

            <div className="p-3">
              <h4 className="font-medium text-sm mb-2">Latest Updates</h4>
              <div className="space-y-2">
                {updates.map((update) => (
                  <div
                    key={update.id}
                    className={`p-2 rounded-md text-sm ${
                      update.isRead ? "bg-muted/10" : "bg-primary/5 font-medium"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">{getUpdateIcon(update.type)}</div>
                      <div className="flex-1">
                        <p className="text-sm">{update.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTimeAgo(update.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {user?.role !== "doctor" && (
              <div className="flex justify-center mt-2">
                <Button
                  variant="outline"
                  className="w-full text-primary"
                  onClick={() => navigate("/consultation-booking")}
                >
                  Book New Consultation
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
