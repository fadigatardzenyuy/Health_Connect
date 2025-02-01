import { User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function PatientList() {
  const { toast } = useToast();

  const patients = [
    {
      id: 1,
      name: "Patient Name 1",
      lastVisit: "3 days ago",
    },
    {
      id: 2,
      name: "Patient Name 2",
      lastVisit: "1 week ago",
    },
    {
      id: 3,
      name: "Patient Name 3",
      lastVisit: "2 weeks ago",
    },
  ];

  const handleViewPatient = (id) => {
    toast({
      title: "Opening patient profile",
      description: `Viewing details for patient #${id}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Patients</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {patients.map((patient) => (
            <div
              key={patient.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{patient.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Last visit: {patient.lastVisit}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewPatient(patient.id)}
              >
                View Profile
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
