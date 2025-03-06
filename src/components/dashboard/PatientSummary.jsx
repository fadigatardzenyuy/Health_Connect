import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, UserRound, Download, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PatientSummary() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");
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
    conditions: [
      { label: "Hypertension", value: 28, color: "#ef4444" },
      { label: "Diabetes", value: 22, color: "#3b82f6" },
      { label: "Asthma", value: 15, color: "#22c55e" },
      { label: "Heart Disease", value: 12, color: "#eab308" },
      { label: "Other", value: 23, color: "#8b5cf6" },
    ],
    loading: true,
  });

  useEffect(() => {
    const fetchDemographics = async () => {
      if (!user?.id) return;

      try {
        setTimeout(() => {
          setData((prev) => ({ ...prev, loading: false }));
        }, 1500);
      } catch (error) {
        console.error("Error fetching demographics:", error);
        toast({
          title: "Error loading data",
          description: "Could not retrieve patient demographics",
          variant: "destructive",
        });
        setData((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchDemographics();
  }, [user?.id, toast]);

  const genderPieData = data.gender.map((item) => ({
    name: item.label,
    value: item.value,
  }));

  const conditionsPieData = data.conditions.map((item) => ({
    name: item.label,
    value: item.value,
  }));

  const handleViewAllPatients = () => {
    toast({
      title: "Generating Report",
      description: "Detailed patient demographics report is being generated.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Exporting Data",
      description: "Patient demographics data is being exported to CSV.",
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
        <CardTitle className="text-xl font-bold">
          Patient Demographics
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button variant="default" size="sm" onClick={handleViewAllPatients}>
            View Report
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
            <TabsList className="h-9">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">
                Overview
              </TabsTrigger>
              <TabsTrigger value="detailed" className="text-xs sm:text-sm">
                Detailed View
              </TabsTrigger>
              <TabsTrigger value="trends" className="text-xs sm:text-sm">
                Trends
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
                  className="pl-8 h-9 w-full sm:w-[180px] text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="h-9 w-[100px] sm:w-[130px]">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Patients</SelectItem>
                  <SelectItem value="new">New Patients</SelectItem>
                  <SelectItem value="recurring">Recurring</SelectItem>
                  <SelectItem value="critical">Critical Care</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {data.loading ? (
            <div className="space-y-4">
              <Skeleton className="h-[220px] w-full rounded-md" />
              <Skeleton className="h-4 w-2/3 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
            </div>
          ) : (
            <>
              <TabsContent value="overview" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-card rounded-lg p-4 border">
                    <h4 className="text-sm font-semibold mb-3">
                      Gender Distribution
                    </h4>
                    <div className="h-[220px] w-full">
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
                          <Legend
                            layout="horizontal"
                            verticalAlign="bottom"
                            align="center"
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-card rounded-lg p-4 border">
                    <h4 className="text-sm font-semibold mb-3">
                      Common Conditions
                    </h4>
                    <div className="h-[220px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={conditionsPieData}
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
                            {data.conditions.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value}%`} />
                          <Legend
                            layout="horizontal"
                            verticalAlign="bottom"
                            align="center"
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-semibold mb-3">
                    Age Distribution
                  </h4>
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
              </TabsContent>

              <TabsContent value="detailed" className="mt-0">
                <div className="bg-card rounded-lg p-4 border">
                  <h4 className="text-sm font-semibold mb-3">
                    Detailed Patient Analysis
                  </h4>
                  <p className="text-muted-foreground text-sm mb-3">
                    This view shows detailed breakdowns of patient demographics,
                    conditions, and treatment outcomes.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <h5 className="text-xs font-medium mb-1">
                        New Patients (30 days)
                      </h5>
                      <p className="text-2xl font-bold">24</p>
                      <p className="text-xs text-muted-foreground">
                        +12% from previous period
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <h5 className="text-xs font-medium mb-1">Average Age</h5>
                      <p className="text-2xl font-bold">42.5</p>
                      <p className="text-xs text-muted-foreground">
                        Median: 39
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <h5 className="text-xs font-medium mb-1">
                        Insurance Coverage
                      </h5>
                      <p className="text-2xl font-bold">87%</p>
                      <p className="text-xs text-muted-foreground">
                        13% self-pay patients
                      </p>
                    </div>
                  </div>
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">
                      Select specific demographics for detailed analysis
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Filter className="h-4 w-4 mr-2" />
                      Customize Report
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="trends" className="mt-0">
                <div className="bg-card rounded-lg p-4 border">
                  <h4 className="text-sm font-semibold mb-3">
                    Patient Population Trends
                  </h4>
                  <p className="text-muted-foreground text-sm mb-6">
                    Analyzing patient demographic changes over the past 12
                    months
                  </p>
                  <div className="flex justify-center items-center h-[200px]">
                    <div className="text-center">
                      <UserRound className="h-10 w-10 text-primary mx-auto mb-4 opacity-50" />
                      <p className="text-sm text-muted-foreground">
                        Trend analysis requires at least 12 months of patient
                        data.
                        <br />
                        Continue adding patient records to enable this feature.
                      </p>
                      <Button variant="outline" size="sm" className="mt-4">
                        Import Historical Data
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
