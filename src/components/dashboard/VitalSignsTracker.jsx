import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  Thermometer,
  Heart,
  ArrowUp,
  ArrowDown,
  Plus,
  Scale,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function VitalSignsTracker({ patientId }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [vitalRecords, setVitalRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVitalRecords = async () => {
      try {
        if (!patientId) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("vital_records")
          .select("*")
          .eq("patient_id", patientId)
          .order("recorded_at", { ascending: false });

        if (error) throw error;

        setVitalRecords(data || []);
      } catch (error) {
        console.error("Error fetching vital records:", error);
        toast({
          title: "Error",
          description: "Failed to load vital sign records",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVitalRecords();
  }, [patientId, toast]);

  const handleAddVitals = () => {
    toast({
      title: "Add Vital Signs",
      description: "Opening form to record new vital signs",
    });
  };

  // Process data for charts
  const getChartData = () => {
    const chartData = [...vitalRecords]
      .sort(
        (a, b) =>
          new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
      )
      .map((record) => ({
        date: format(new Date(record.recorded_at), "MM/dd"),
        heartRate: record.heart_rate,
        temperature: record.temperature,
        respiratory: record.respiratory_rate,
        systolic: record.blood_pressure
          ? parseFloat(record.blood_pressure.split("/")[0])
          : null,
        diastolic: record.blood_pressure
          ? parseFloat(record.blood_pressure.split("/")[1])
          : null,
      }));

    return chartData;
  };

  const getMostRecentVitals = () => {
    return vitalRecords[0] || null;
  };

  const mostRecent = getMostRecentVitals();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vital Signs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
            </div>
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Vital Signs</CardTitle>
        {user?.role === "doctor" && (
          <Button size="sm" onClick={handleAddVitals}>
            <Plus className="h-4 w-4 mr-1" /> Record Vitals
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {vitalRecords.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-2 text-muted-foreground/60" />
            <p>No vital signs recorded yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-rose-500" />
                    <span className="text-sm font-medium">Heart Rate</span>
                  </div>
                  {mostRecent?.heart_rate && (
                    <span className="text-xs bg-rose-100 text-rose-800 px-2 py-1 rounded-full">
                      {mostRecent.heart_rate > 100 ? (
                        <ArrowUp className="h-3 w-3 inline" />
                      ) : (
                        <ArrowDown className="h-3 w-3 inline" />
                      )}
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold mt-2">
                  {mostRecent?.heart_rate || "-"}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    bpm
                  </span>
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium">Blood Pressure</span>
                  </div>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {mostRecent?.blood_pressure || "-"}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    mmHg
                  </span>
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-amber-500" />
                    <span className="text-sm font-medium">Temperature</span>
                  </div>
                  {mostRecent?.temperature && (
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                      {mostRecent.temperature > 37.5 ? (
                        <ArrowUp className="h-3 w-3 inline" />
                      ) : (
                        <ArrowDown className="h-3 w-3 inline" />
                      )}
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold mt-2">
                  {mostRecent?.temperature || "-"}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    °C
                  </span>
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">BMI</span>
                  </div>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {mostRecent?.bmi || "-"}
                </p>
              </div>
            </div>

            {vitalRecords.length > 1 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Heart Rate Trend</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={getChartData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="heartRate"
                        stroke="#ef4444"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Last Recorded</h3>
              <p className="text-sm text-muted-foreground">
                {mostRecent
                  ? format(new Date(mostRecent.recorded_at), "PPpp")
                  : "-"}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
