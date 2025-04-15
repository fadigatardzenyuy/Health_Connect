import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Video,
  Phone,
  User,
  Flag,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";

export function AppointmentCalendar({
  appointments = [],
  isLoading = false,
  userRole = "patient",
  onDateSelect,
}) {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateSelect = (date) => {
    if (!date) return;

    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  // Filter appointments for the selected date
  const filteredAppointments = appointments.filter((appointment) => {
    if (!selectedDate) return false;

    const appointmentDate = new Date(appointment.date);
    return (
      appointmentDate.getDate() === selectedDate.getDate() &&
      appointmentDate.getMonth() === selectedDate.getMonth() &&
      appointmentDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  // Get dates with appointments for highlighting in calendar
  const appointmentDates = appointments.map(
    (appointment) => new Date(appointment.date)
  );

  // Color assignments for appointment types
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    confirmed: "bg-green-100 text-green-800 hover:bg-green-200",
    cancelled: "bg-red-100 text-red-800 hover:bg-red-200",
    completed: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  };

  const priorityColors = {
    high: "border-l-4 border-red-500",
    medium: "border-l-4 border-yellow-500",
    low: "border-l-4 border-green-500",
  };

  const typeIcons = {
    video: <Video className="h-4 w-4 text-primary" />,
    audio: <Phone className="h-4 w-4 text-primary" />,
    "in-person": <Building className="h-4 w-4 text-primary" />,
  };

  const handleViewDetails = (id) => {
    navigate(`/appointment-details/${id}`);
  };

  const handleJoinConsultation = (id, type) => {
    navigate(`/${type}-consultation/${id}`);
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Appointment Calendar</CardTitle>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedDate(new Date());
            }}
          >
            Today
          </Button>
          <Button size="sm" onClick={() => navigate("/consultation-booking")}>
            Book New
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-4">
        <div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className={cn("border rounded-md p-3 pointer-events-auto")}
            modifiers={{
              hasAppointment: appointmentDates,
            }}
            modifiersStyles={{
              hasAppointment: {
                fontWeight: "bold",
                backgroundColor: "rgba(124, 58, 237, 0.1)",
                color: "rgb(124, 58, 237)",
              },
            }}
          />
        </div>
        <div className="flex flex-col space-y-4">
          <h3 className="font-medium text-lg">
            {selectedDate ? (
              <>Appointments for {format(selectedDate, "MMMM d, yyyy")}</>
            ) : (
              <>Select a date</>
            )}
          </h3>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse flex items-center space-x-4 p-3 border rounded-md"
                >
                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                    <div className="h-3 w-1/2 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-medium mb-1">
                No appointments scheduled
              </h3>
              <p className="text-muted-foreground text-sm max-w-sm">
                You don't have any appointments scheduled for this day.
              </p>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[350px] space-y-3 pr-1">
              {filteredAppointments.map((appointment) => {
                const isPast =
                  new Date(
                    `${format(appointment.date, "yyyy-MM-dd")}T${
                      appointment.time
                    }`
                  ) < new Date();
                const isToday =
                  format(appointment.date, "yyyy-MM-dd") ===
                  format(new Date(), "yyyy-MM-dd");
                const showJoinButton =
                  isToday &&
                  !isPast &&
                  appointment.status === "confirmed" &&
                  (appointment.type === "video" ||
                    appointment.type === "audio");

                return (
                  <div
                    key={appointment.id}
                    className={cn(
                      "p-3 border rounded-lg hover:bg-muted/10 transition-colors",
                      appointment.priority
                        ? priorityColors[appointment.priority]
                        : ""
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Building className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium truncate max-w-[150px]">
                          {appointment.hospitalName || "Hospital"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge className={statusColors[appointment.status]}>
                          {appointment.status}
                        </Badge>
                        {appointment.priority === "high" && (
                          <Badge
                            variant="outline"
                            className="bg-red-50 text-red-800 border-red-200"
                          >
                            <Flag className="h-3 w-3 mr-1" />
                            Priority
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="text-sm mb-1">
                      {appointment.departmentName} • {appointment.doctorName}
                    </div>

                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {typeIcons[appointment.type]}
                        <span className="capitalize">{appointment.type}</span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 px-2"
                        onClick={() => handleViewDetails(appointment.id)}
                      >
                        Details
                      </Button>

                      {showJoinButton && appointment.type !== "in-person" && (
                        <Button
                          size="sm"
                          className="text-xs h-7 px-2"
                          onClick={() =>
                            handleJoinConsultation(
                              appointment.id,
                              appointment.type
                            )
                          }
                        >
                          Join Now
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
export default AppointmentCalendar;
