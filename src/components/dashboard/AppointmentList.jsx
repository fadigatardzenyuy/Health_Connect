import { User, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function AppointmentList() {
  const { toast } = useToast();

  const appointments = [
    {
      id: 1,
      patientName: "Patient Name 1",
      type: "General Checkup",
      date: "Today, 2:00 PM",
    },
    {
      id: 2,
      patientName: "Patient Name 2",
      type: "Follow-up",
      date: "Today, 3:30 PM",
    },
    {
      id: 3,
      patientName: "Patient Name 3",
      type: "Consultation",
      date: "Today, 4:15 PM",
    },
  ];

  const handleViewDetails = (id) => {
    toast({
      title: "Opening appointment details",
      description: `Viewing details for appointment #${id}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{apt.patientName}</h4>
                  <p className="text-sm text-muted-foreground">{apt.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{apt.date}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewDetails(apt.id)}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
