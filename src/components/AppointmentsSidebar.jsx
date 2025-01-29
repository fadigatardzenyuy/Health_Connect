import {
  Calendar,
  MapPin,
  Clock,
  VideoIcon,
  Phone,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export function AppointmentsSidebar() {
  const navigate = useNavigate();

  const appointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      date: "June 15, 2023 at 10:00 AM",
      location: "Video Consultation",
      type: "video",
      status: "upcoming",
    },
    {
      id: 2,
      doctor: "Dr. Michael Brown",
      specialty: "Dermatologist",
      date: "June 20, 2023 at 2:30 PM",
      location: "Audio Call",
      type: "audio",
      status: "scheduled",
    },
    {
      id: 3,
      doctor: "Dr. Emily White",
      specialty: "General Practitioner",
      date: "June 22, 2023 at 3:00 PM",
      location: "Chat Consultation",
      type: "message",
      status: "pending",
    },
  ];

  const updates = [
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
  ];

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

  const getStatusBadge = (status) => {
    switch (status) {
      case "upcoming":
        return <Badge variant="secondary">Upcoming</Badge>;
      case "scheduled":
        return <Badge variant="outline">Scheduled</Badge>;
      case "pending":
        return <Badge variant="default">Pending</Badge>;
      default:
        return null;
    }
  };

  const handleBookConsultation = () => {
    navigate("/consultation-booking");
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
            <a href="#" className="text-sm text-primary hover:underline">
              View all
            </a>
          </h2>

          {appointments.map((apt) => (
            <div key={apt.id} className="border-b pb-4 last:border-0">
              <div className="flex items-start gap-3">
                {getConsultationIcon(apt.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-medium truncate">{apt.doctor}</h3>
                    {getStatusBadge(apt.status)}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {apt.specialty}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span className="truncate">{apt.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="truncate">{apt.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
