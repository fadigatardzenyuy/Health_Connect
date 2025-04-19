import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Building,
  Calendar,
  ChevronDown,
  Clock,
  FileText,
  MapPin,
  Phone,
  Video,
} from "lucide-react";
import { format, addDays } from "date-fns";
import { useNavigate } from "react-router-dom";

// Mock appointments for demonstration
const mockAppointments = [
  {
    id: "appt-1",
    hospitalName: "General Hospital",
    departmentName: "Cardiology",
    doctorName: "Dr. Sarah Johnson",
    date: addDays(new Date(), 2),
    time: "10:30 AM",
    type: "video",
    status: "confirmed",
    location: "East Wing, Floor 3",
    preparationInstructions:
      "Please fast for 12 hours before your appointment. Bring a list of your current medications.",
    estimatedCost: "$75 - $125",
    insuranceCovered: "Yes (80% coverage)",
  },
  {
    id: "appt-2",
    hospitalName: "Memorial Medical Center",
    departmentName: "Dermatology",
    doctorName: "Dr. Michael Chen",
    date: addDays(new Date(), 5),
    time: "2:15 PM",
    type: "in-person",
    status: "confirmed",
    location: "West Building, Suite 204",
    preparationInstructions:
      "No special preparation required. Wear clothing that allows easy examination of affected areas.",
    estimatedCost: "$150 - $200",
    insuranceCovered: "Partial coverage (check with provider)",
  },
  {
    id: "appt-3",
    hospitalName: "University Hospital",
    departmentName: "Radiology",
    doctorName: "Dr. Emily Wilson",
    date: addDays(new Date(), 8),
    time: "11:00 AM",
    type: "in-person",
    status: "pending",
    location: "Imaging Center, Ground Floor",
    preparationInstructions:
      "Wear comfortable clothing without metal fasteners. No food or drink 4 hours before your appointment.",
    estimatedCost: "$350 - $500",
    insuranceCovered: "Yes (90% coverage after deductible)",
  },
];

export const UpcomingAppointments = () => {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return null;
    }
  };

  const handleReschedule = (id) => {
    console.log(`Reschedule appointment ${id}`);
  };

  const handleCancel = (id) => {
    setAppointments(
      appointments.map((apt) =>
        apt.id === id ? { ...apt, status: "cancelled" } : apt
      )
    );
  };

  const handleViewDetails = (id) => {
    navigate(`/appointment-details/${id}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
        <CardDescription>Your scheduled hospital appointments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <Collapsible
              key={appointment.id}
              open={expandedId === appointment.id}
              onOpenChange={() => toggleExpand(appointment.id)}
              className="border rounded-lg overflow-hidden"
            >
              <div className="p-4 flex flex-col md:flex-row md:items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">{appointment.hospitalName}</h3>
                    {getStatusBadge(appointment.status)}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {appointment.departmentName} · {appointment.doctorName}
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      <span>{format(appointment.date, "MMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-3 w-3" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      {appointment.type === "video" ? (
                        <Video className="h-3 w-3" />
                      ) : (
                        <MapPin className="h-3 w-3" />
                      )}
                      <span className="capitalize">{appointment.type}</span>
                    </div>
                  </div>
                </div>

                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="mt-2 md:mt-0">
                    <span>
                      {expandedId === appointment.id
                        ? "Less details"
                        : "More details"}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 ml-1 transition-transform ${
                        expandedId === appointment.id ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent>
                <div className="p-4 pt-0 border-t mt-2">
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    {appointment.type === "in-person" && (
                      <div className="space-y-1">
                        <dt className="text-muted-foreground">Location</dt>
                        <dd className="font-medium flex items-center">
                          <MapPin className="h-3 w-3 mr-1 text-primary" />
                          {appointment.location}
                        </dd>
                      </div>
                    )}

                    <div className="space-y-1">
                      <dt className="text-muted-foreground">Preparation</dt>
                      <dd className="font-medium flex items-start">
                        <FileText className="h-3 w-3 mr-1 text-primary mt-1" />
                        <span>{appointment.preparationInstructions}</span>
                      </dd>
                    </div>

                    <div className="space-y-1">
                      <dt className="text-muted-foreground">Estimated Cost</dt>
                      <dd className="font-medium">
                        {appointment.estimatedCost}
                      </dd>
                    </div>

                    <div className="space-y-1">
                      <dt className="text-muted-foreground">
                        Insurance Coverage
                      </dt>
                      <dd className="font-medium">
                        {appointment.insuranceCovered}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4 pt-4 border-t flex flex-wrap justify-end gap-2">
                    {appointment.status !== "cancelled" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancel(appointment.id)}
                        >
                          Cancel
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReschedule(appointment.id)}
                        >
                          Reschedule
                        </Button>
                      </>
                    )}

                    <Button
                      size="sm"
                      onClick={() => handleViewDetails(appointment.id)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))
        ) : (
          <div className="text-center py-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              No appointments scheduled
            </h3>
            <p className="text-muted-foreground mb-4">
              You don't have any upcoming appointments
            </p>
            <Button>Book an appointment</Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => navigate("/medical-history")}>
          View Medical History
        </Button>
        <Button onClick={() => navigate("/consultation-booking")}>
          Book New Appointment
        </Button>
      </CardFooter>
    </Card>
  );
};
