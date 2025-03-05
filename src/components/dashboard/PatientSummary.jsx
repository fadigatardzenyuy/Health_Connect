import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function PatientSummary() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState({
    gender: [
      { label: "Female", value: 45, color: "#f472b6" },
      { label: "Male", value: 52, color: "#60a5fa" },
      { label: "Non-binary", value: 3, color: "#c084fc" },
    ],
    age: [
      { label: "0-18", value: 15 },
      { label: "19-35", value: 30 },
      { label: "36-50", value: 35 },
      { label: "51-65", value: 15 },
      { label: "65+", value: 5 },
    ],
    loading: true,
  });

  useEffect(() => {
    const fetchDemographics = async () => {
      if (!user?.id) return;

      try {
        // Simulate API delay
        setTimeout(() => {
          setData((prev) => ({ ...prev, loading: false }));
        }, 1500);
      } catch (error) {
        console.error("Error fetching demographics:", error);
        setData((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchDemographics();
  }, [user?.id]);

  const genderPieData = data.gender.map((item) => ({
    name: item.label,
    value: item.value,
  }));

  const handleViewAllPatients = () => {
    toast({
      title: "Patient Demographics",
      description: "Detailed patient demographics report is being generated.",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Patient Demographics</CardTitle>
        <Button variant="outline" size="sm" onClick={handleViewAllPatients}>
          View Report
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.loading ? (
          <div className="space-y-4">
            <Skeleton className="h-[180px] w-full rounded-md" />
            <Skeleton className="h-4 w-2/3 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
          </div>
        ) : (
          <>
            <div>
              <h4 className="text-sm font-medium mb-3">Gender Distribution</h4>
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {data.gender.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Age Distribution</h4>
              <div className="space-y-3">
                {data.age.map((group) => (
                  <div key={group.label} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{group.label} years</span>
                      <span className="font-medium">{group.value}%</span>
                    </div>
                    <Progress value={group.value} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
