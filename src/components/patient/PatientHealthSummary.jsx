import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function PatientHealthSummary() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("medical_records")
          .select(
            `id,
            created_at,
            doctor_id, 
            patient_id,
            diagnosis,
            symptoms,
            prescription,
            doctor:profiles!doctor_id (
              full_name,
              specialization
            )`
          )
          .eq("patient_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching medical records:", error);
          return;
        }

        const formattedData = data.map((record) => ({
          ...record,
          doctor: Array.isArray(record.doctor)
            ? record.doctor[0]
            : record.doctor,
        }));

        setRecords(formattedData);
      } catch (error) {
        console.error("Error in fetchMedicalRecords:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedicalRecords();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No medical records found.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="all" className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Medical History</h2>
        <TabsList>
          <TabsTrigger value="all">All Records</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="all" className="space-y-4">
        {records.map((record) => (
          <MedicalRecordCard key={record.id} record={record} />
        ))}
      </TabsContent>

      <TabsContent value="recent" className="space-y-4">
        {records.slice(0, 3).map((record) => (
          <MedicalRecordCard key={record.id} record={record} />
        ))}
      </TabsContent>
    </Tabs>
  );
}

function MedicalRecordCard({ record }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {record.doctor.full_name?.charAt(0) || "D"}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">
                Dr. {record.doctor.full_name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {record.doctor.specialization}
              </p>
            </div>
          </div>
          <span className="text-sm text-muted-foreground">
            {format(new Date(record.created_at), "MMM d, yyyy")}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div>
            <h4 className="text-sm font-medium mb-1">Diagnosis</h4>
            <p className="text-sm">{record.diagnosis}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Symptoms</h4>
            <p className="text-sm">{record.symptoms}</p>
          </div>
          {record.prescription && (
            <div>
              <h4 className="text-sm font-medium mb-1">Prescription</h4>
              <p className="text-sm">{record.prescription}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
