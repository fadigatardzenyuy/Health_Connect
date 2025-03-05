import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export function PerformanceMetrics() {
  const { user } = useAuth();
  const [data, setData] = useState({
    appointments: [
      { name: "Mon", count: 4 },
      { name: "Tue", count: 7 },
      { name: "Wed", count: 5 },
      { name: "Thu", count: 8 },
      { name: "Fri", count: 10 },
      { name: "Sat", count: 3 },
      { name: "Sun", count: 1 },
    ],
    patients: [
      { name: "Jan", count: 12 },
      { name: "Feb", count: 19 },
      { name: "Mar", count: 23 },
      { name: "Apr", count: 27 },
      { name: "May", count: 32 },
      { name: "Jun", count: 38 },
      { name: "Jul", count: 42 },
    ],
    consultationTime: [
      { name: "9 AM", minutes: 25 },
      { name: "10 AM", minutes: 35 },
      { name: "11 AM", minutes: 30 },
      { name: "12 PM", minutes: 20 },
      { name: "1 PM", minutes: 15 },
      { name: "2 PM", minutes: 30 },
      { name: "3 PM", minutes: 40 },
      { name: "4 PM", minutes: 25 },
    ],
    loading: true,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!user?.id) return;

      try {
        // Simulate API delay
        setTimeout(() => {
          setData((prev) => ({ ...prev, loading: false }));
        }, 1500);
      } catch (error) {
        console.error("Error fetching metrics:", error);
        setData((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchMetrics();
  }, [user?.id]);

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>
          Analytics and statistics about your practice
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.loading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full max-w-md rounded-md" />
            <Skeleton className="h-[300px] w-full rounded-md" />
          </div>
        ) : (
          <Tabs defaultValue="appointments" className="space-y-4">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="patients">Patients</TabsTrigger>
              <TabsTrigger value="consultation">Consultation Time</TabsTrigger>
            </TabsList>

            <TabsContent value="appointments" className="space-y-4">
              <h3 className="text-lg font-medium">Weekly Appointments</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.appointments}
                    margin={{ top: 20, right: 30, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                      formatter={(value) => [`${value} appointments`, "Count"]}
                      labelFormatter={(label) => `${label}`}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        borderRadius: "6px",
                        border: "1px solid #e2e8f0",
                      }}
                    />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="patients" className="space-y-4">
              <h3 className="text-lg font-medium">Monthly Patient Growth</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data.patients}
                    margin={{ top: 20, right: 30, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                      formatter={(value) => [`${value} patients`, "Count"]}
                      labelFormatter={(label) => `${label}`}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        borderRadius: "6px",
                        border: "1px solid #e2e8f0",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#16a34a"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="consultation" className="space-y-4">
              <h3 className="text-lg font-medium">Average Consultation Time</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.consultationTime}
                    margin={{ top: 20, right: 30, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                      formatter={(value) => [`${value} minutes`, "Duration"]}
                      labelFormatter={(label) => `${label}`}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        borderRadius: "6px",
                        border: "1px solid #e2e8f0",
                      }}
                    />
                    <Bar
                      dataKey="minutes"
                      fill="#f97316"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
