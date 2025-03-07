import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Plus, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

export function MedicalRecordsList({ patientId }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        if (!patientId) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("medical_records")
          .select(
            `
            *,
            doctor:doctor_id(full_name)
          `
          )
          .eq("patient_id", patientId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setMedicalRecords(data || []);
      } catch (error) {
        console.error("Error fetching medical records:", error);
        toast({
          title: "Error",
          description: "Failed to load medical records",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalRecords();
  }, [patientId, toast]);

  const handleAddRecord = () => {
    toast({
      title: "Add Medical Record",
      description: "Opening form to add a new medical record",
    });
  };

  const handleViewDetail = (id) => {
    toast({
      title: "View Record",
      description: "Opening detailed view of the medical record",
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medical Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 border rounded-lg animate-pulse"
              >
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Medical Records</CardTitle>
        {user?.role === "doctor" && (
          <Button size="sm" onClick={handleAddRecord}>
            <Plus className="h-4 w-4 mr-1" /> Add Record
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {medicalRecords.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-2 text-muted-foreground/60" />
            <p>No medical records available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {medicalRecords.map((record) => (
              <div
                key={record.id}
                className="flex items-start justify-between p-4 border rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">
                      {record.diagnosis || "General Consultation"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {record.doctor?.full_name || "Doctor"} -{" "}
                      {format(new Date(record.created_at), "PPP")}
                    </p>
                    {record.follow_up_date && (
                      <p className="text-xs mt-1">
                        <span className="font-medium">Follow-up:</span>{" "}
                        {format(new Date(record.follow_up_date), "PPP")}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleViewDetail(record.id)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
