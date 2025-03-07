import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Pill,
  Activity,
  Clock,
  Calendar,
  AlertTriangle,
  ChevronRight,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export function PatientHealthSummary() {
  const [activeTab, setActiveTab] = useState("records");
  const [isLoading, setIsLoading] = useState(true);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [vitals, setVitals] = useState([]);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchHealthData = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);

        // Fetch medical records
        const { data: recordsData, error: recordsError } = await supabase
          .from("medical_records")
          .select(
            `
            id,
            created_at,
            doctor_id,
            patient_id,
            diagnosis,
            symptoms,
            prescription,
            doctor:profiles!doctor_id(full_name, specialization)
          `
          )
          .eq("patient_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (recordsError) throw recordsError;
        setMedicalRecords(recordsData || []);

        // Fetch vital signs
        const { data: vitalsData, error: vitalsError } = await supabase
          .from("vital_records")
          .select("*")
          .eq("patient_id", user.id)
          .order("recorded_at", { ascending: false })
          .limit(5);

        if (vitalsError) throw vitalsError;
        setVitals(vitalsData || []);

        // For demo purposes, generate some prescriptions
        // In a real app, you would fetch them from a 'prescriptions' table
        const mockPrescriptions = [
          {
            id: "1",
            name: "Amoxicillin",
            dosage: "500mg",
            frequency: "Three times a day",
            duration: "7 days",
            date: "2023-05-15",
            doctor: "Dr. Jane Smith",
          },
          {
            id: "2",
            name: "Ibuprofen",
            dosage: "200mg",
            frequency: "Every 6 hours as needed",
            duration: "5 days",
            date: "2023-06-02",
            doctor: "Dr. Robert Chen",
          },
        ];

        setPrescriptions(mockPrescriptions);
      } catch (error) {
        console.error("Error fetching health data:", error);
        toast({
          title: "Error",
          description: "Failed to load your health records",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHealthData();
  }, [user?.id, toast]);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Your Health Summary</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/medical-history")}
        >
          View All
        </Button>
      </CardHeader>
      <CardContent className="px-3">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="records" className="text-xs sm:text-sm">
              <FileText className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Medical</span> Records
            </TabsTrigger>
            <TabsTrigger value="prescriptions" className="text-xs sm:text-sm">
              <Pill className="h-4 w-4 mr-1 sm:mr-2" />
              Prescriptions
            </TabsTrigger>
            <TabsTrigger value="vitals" className="text-xs sm:text-sm">
              <Activity className="h-4 w-4 mr-1 sm:mr-2" />
              Vital Signs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="records" className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse space-y-2 p-3 border rounded-lg"
                  >
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                ))}
              </div>
            ) : medicalRecords.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-medium mb-1">No records found</h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  You don't have any medical records in the system yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {medicalRecords.map((record) => (
                  <div
                    key={record.id}
                    className="p-3 border rounded-lg hover:bg-muted/5 transition-colors"
                  >
                    <div className="flex justify-between mb-1">
                      <h3 className="font-medium text-sm">
                        {record.diagnosis}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(record.created_at), "MMM d, yyyy")}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-2">
                      {record.symptoms?.map((symptom, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {symptom}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">
                        Dr. {record.doctor?.full_name.split(" ")[1]}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 flex items-center gap-1"
                      >
                        View Details
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="prescriptions" className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse space-y-2 p-3 border rounded-lg"
                  >
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                ))}
              </div>
            ) : prescriptions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-medium mb-1">
                  No prescriptions found
                </h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  You don't have any active prescriptions.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {prescriptions.map((prescription) => (
                  <div
                    key={prescription.id}
                    className="p-3 border rounded-lg hover:bg-muted/5 transition-colors"
                  >
                    <div className="flex justify-between mb-1">
                      <h3 className="font-medium text-sm">
                        {prescription.name} {prescription.dosage}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {prescription.date}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground mb-2">
                      {prescription.frequency} for {prescription.duration}
                    </p>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">
                        {prescription.doctor}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 flex items-center gap-1"
                      >
                        View Details
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="pt-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/eprescriptions")}
                  >
                    View ePrescriptions
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="vitals" className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse space-y-2 p-3 border rounded-lg"
                  >
                    <Skeleton className="h-4 w-1/3 mb-2" />
                    <div className="grid grid-cols-2 gap-2">
                      <Skeleton className="h-10 w-full rounded-lg" />
                      <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            ) : vitals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-medium mb-1">
                  No vital records found
                </h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  No vital signs have been recorded yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {vitals.map((vital) => (
                  <div
                    key={vital.id}
                    className="p-3 border rounded-lg hover:bg-muted/5 transition-colors"
                  >
                    <div className="flex justify-between mb-3">
                      <h3 className="font-medium text-sm">Vital Signs</h3>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(vital.recorded_at), "MMM d, yyyy")}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {vital.heart_rate && (
                        <div className="flex items-center p-2 border rounded bg-muted/5">
                          <Heart className="h-5 w-5 text-red-500 mr-2" />
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Heart Rate
                            </p>
                            <p className="font-medium">
                              {vital.heart_rate} bpm
                            </p>
                          </div>
                        </div>
                      )}

                      {vital.blood_pressure && (
                        <div className="flex items-center p-2 border rounded bg-muted/5">
                          <Activity className="h-5 w-5 text-blue-500 mr-2" />
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Blood Pressure
                            </p>
                            <p className="font-medium">
                              {vital.blood_pressure}
                            </p>
                          </div>
                        </div>
                      )}

                      {vital.temperature && (
                        <div className="flex items-center p-2 border rounded bg-muted/5">
                          <Activity className="h-5 w-5 text-orange-500 mr-2" />
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Temperature
                            </p>
                            <p className="font-medium">{vital.temperature}°C</p>
                          </div>
                        </div>
                      )}

                      {vital.respiratory_rate && (
                        <div className="flex items-center p-2 border rounded bg-muted/5">
                          <Activity className="h-5 w-5 text-green-500 mr-2" />
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Resp. Rate
                            </p>
                            <p className="font-medium">
                              {vital.respiratory_rate}/min
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
