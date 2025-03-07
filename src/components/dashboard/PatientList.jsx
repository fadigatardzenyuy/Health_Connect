import { User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { PatientDetail } from "./PatientDetail";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export function PatientList() {
  const { toast } = useToast();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setTimeout(() => {
          setPatients([
            {
              id: "p1",
              name: "John Doe",
              lastVisit: "3 days ago",
              status: "Follow-up",
            },
            {
              id: "p2",
              name: "Jane Smith",
              lastVisit: "1 week ago",
              status: "New",
            },
            {
              id: "p3",
              name: "Robert Johnson",
              lastVisit: "2 weeks ago",
              status: "Ongoing",
            },
            {
              id: "p4",
              name: "Lisa Chen",
              lastVisit: "1 month ago",
              status: "Recovered",
            },
            {
              id: "p5",
              name: "Michael Brown",
              lastVisit: "3 months ago",
              status: "Annual check-up",
            },
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast({
          title: "Error",
          description: "Failed to load patient data",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchPatients();
  }, [toast]);

  const handleViewPatient = (id) => {
    setSelectedPatientId(id);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setTimeout(() => setSelectedPatientId(null), 300);
  };

  return (
    <>
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
        <CardContent>
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
                      <h4 className="font-medium">{patient.name}</h4>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">
                          Last visit: {patient.lastVisit}
                        </p>
                        {patient.status && (
                          <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                            {patient.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
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
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
