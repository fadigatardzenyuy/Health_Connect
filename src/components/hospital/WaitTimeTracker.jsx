import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  Users,
  AlertCircle,
  CheckCircle,
  UserMinus,
  CalendarClock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock wait time data
const mockAppointments = [
  {
    id: "apt1",
    hospitalName: "General Hospital",
    departmentName: "Cardiology",
    doctorName: "Dr. Smith",
    appointmentTime: "10:30 AM",
    estimatedWaitTime: 15,
    queuePosition: 3,
    totalInQueue: 5,
    status: "scheduled",
    checkInTime: null,
    notified: false,
  },
  {
    id: "apt2",
    hospitalName: "Community Medical Center",
    departmentName: "Radiology",
    doctorName: "Dr. Johnson",
    appointmentTime: "2:45 PM",
    estimatedWaitTime: 30,
    queuePosition: 8,
    totalInQueue: 12,
    status: "scheduled",
    checkInTime: null,
    notified: true,
  },
];

export const WaitTimeTracker = () => {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Simulate real-time updates
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setAppointments((prev) =>
        prev.map((apt) => {
          if (apt.status !== "scheduled") return apt;

          // Randomly decrease wait time and queue position to simulate progress
          if (Math.random() > 0.7) {
            const newWaitTime = Math.max(0, apt.estimatedWaitTime - 1);
            const newQueuePosition =
              newWaitTime === 0 ? 0 : Math.max(1, apt.queuePosition - 1);

            // Notify the patient if they're next
            if (
              newQueuePosition === 1 &&
              apt.queuePosition > 1 &&
              !apt.notified
            ) {
              toast({
                title: "You're next!",
                description: `Get ready for your appointment with ${apt.doctorName}`,
              });
              return {
                ...apt,
                estimatedWaitTime: newWaitTime,
                queuePosition: newQueuePosition,
                notified: true,
              };
            }

            return {
              ...apt,
              estimatedWaitTime: newWaitTime,
              queuePosition: newQueuePosition,
            };
          }
          return apt;
        })
      );
    }, 5000);

    return () => clearInterval(updateInterval);
  }, [toast]);

  const handleDigitalCheckIn = (appointmentId) => {
    setIsLoading(true);

    // Simulate API call for check-in
    setTimeout(() => {
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId
            ? {
                ...apt,
                status: "in-progress",
                checkInTime: new Date().toLocaleTimeString(),
              }
            : apt
        )
      );

      toast({
        title: "Check-in successful!",
        description: "You have been added to the virtual queue.",
      });

      setIsLoading(false);
    }, 1500);
  };

  const getWaitTimeColor = (minutes) => {
    if (minutes <= 10) return "text-green-600";
    if (minutes <= 30) return "text-yellow-600";
    return "text-red-600";
  };

  const getQueueProgress = (position, total) => {
    return 100 - (position / total) * 100;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Scheduled
          </Badge>
        );
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800">
            In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl">Wait Time Tracker</CardTitle>
          <CardDescription>
            Monitor your position in queue and estimated wait times
          </CardDescription>
        </CardHeader>
        <CardContent>
          {appointments.length > 0 ? (
            <div className="space-y-6">
              {appointments.map((appointment) => (
                <Card key={appointment.id} className="overflow-hidden">
                  <div
                    className={`h-2 ${
                      appointment.status === "in-progress"
                        ? "bg-amber-500"
                        : appointment.status === "completed"
                        ? "bg-green-500"
                        : appointment.status === "cancelled"
                        ? "bg-red-500"
                        : "bg-blue-500"
                    }`}
                  ></div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">
                            {appointment.hospitalName}
                          </h3>
                          <p className="text-muted-foreground">
                            {appointment.departmentName} ·{" "}
                            {appointment.doctorName}
                          </p>
                        </div>
                        {getStatusBadge(appointment.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                        <div className="flex flex-col">
                          <div className="text-sm text-muted-foreground mb-1">
                            Appointment Time
                          </div>
                          <div className="flex items-center">
                            <CalendarClock className="h-4 w-4 mr-1 text-primary" />
                            <span>{appointment.appointmentTime}</span>
                          </div>
                        </div>

                        <div className="flex flex-col">
                          <div className="text-sm text-muted-foreground mb-1">
                            Estimated Wait
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-primary" />
                            <span
                              className={getWaitTimeColor(
                                appointment.estimatedWaitTime
                              )}
                            >
                              {appointment.estimatedWaitTime} minutes
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col">
                          <div className="text-sm text-muted-foreground mb-1">
                            Queue Position
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-primary" />
                            <span>
                              {appointment.queuePosition} of{" "}
                              {appointment.totalInQueue}
                            </span>
                          </div>
                        </div>
                      </div>

                      {appointment.status === "scheduled" && (
                        <>
                          <div className="pt-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Queue Progress</span>
                              <span>
                                {Math.round(
                                  getQueueProgress(
                                    appointment.queuePosition,
                                    appointment.totalInQueue
                                  )
                                )}
                                %
                              </span>
                            </div>
                            <Progress
                              value={getQueueProgress(
                                appointment.queuePosition,
                                appointment.totalInQueue
                              )}
                              className="h-2"
                            />
                          </div>

                          <div className="flex justify-between items-center pt-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    Wait times are approximate
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs text-xs">
                                    Wait times update dynamically based on
                                    patient flow and doctor availability.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setAppointments((prev) =>
                                    prev.map((apt) =>
                                      apt.id === appointment.id
                                        ? { ...apt, status: "cancelled" }
                                        : apt
                                    )
                                  );
                                  toast({
                                    title: "Appointment Cancelled",
                                    description:
                                      "Your appointment has been cancelled.",
                                  });
                                }}
                              >
                                <UserMinus className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                disabled={isLoading}
                                onClick={() =>
                                  handleDigitalCheckIn(appointment.id)
                                }
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Check In
                              </Button>
                            </div>
                          </div>
                        </>
                      )}

                      {appointment.status === "in-progress" &&
                        appointment.checkInTime && (
                          <div className="bg-amber-50 border border-amber-100 rounded-md p-3 text-sm">
                            <p className="text-amber-800">
                              <AlertCircle className="h-4 w-4 inline mr-1" />
                              You checked in at {appointment.checkInTime}. A
                              staff member will call you shortly.
                            </p>
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                <CalendarClock className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-lg mb-2">
                No appointments scheduled
              </h3>
              <p className="text-muted-foreground mb-4">
                You don't have any upcoming appointments to track
              </p>
              <Button
                onClick={() => {
                  // Navigate to hospital finder
                }}
              >
                Book an appointment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
