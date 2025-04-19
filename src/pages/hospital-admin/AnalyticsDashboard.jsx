import { useState } from "react";
import { AdminLayout } from "@/components/hospital-admin/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Download,
  Filter,
  BarChart,
  PieChart as PieChartIcon,
  LineChart as LineIcon,
  Printer,
  Share2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock analytics data
const mockVisitData = [
  { department: "Cardiology", scheduled: 120, emergency: 35, walkin: 45 },
  { department: "Orthopedics", scheduled: 90, emergency: 20, walkin: 40 },
  { department: "Pediatrics", scheduled: 110, emergency: 25, walkin: 55 },
  { department: "Neurology", scheduled: 75, emergency: 15, walkin: 30 },
  { department: "Oncology", scheduled: 85, emergency: 10, walkin: 25 },
  { department: "General Medicine", scheduled: 130, emergency: 30, walkin: 60 },
];

const mockTrendData = [
  { month: "Jan", patients: 850, appointments: 920, procedures: 410 },
  { month: "Feb", patients: 830, appointments: 880, procedures: 380 },
  { month: "Mar", patients: 860, appointments: 940, procedures: 430 },
  { month: "Apr", patients: 880, appointments: 960, procedures: 450 },
  { month: "May", patients: 910, appointments: 990, procedures: 470 },
  { month: "Jun", patients: 950, appointments: 1050, procedures: 510 },
  { month: "Jul", patients: 980, appointments: 1100, procedures: 540 },
  { month: "Aug", patients: 1010, appointments: 1150, procedures: 560 },
  { month: "Sep", patients: 990, appointments: 1120, procedures: 530 },
  { month: "Oct", patients: 1020, appointments: 1170, procedures: 570 },
  { month: "Nov", patients: 1050, appointments: 1210, procedures: 590 },
  { month: "Dec", patients: 1100, appointments: 1280, procedures: 630 },
];

const mockPatientDemographics = [
  { name: "0-18", value: 250 },
  { name: "19-35", value: 420 },
  { name: "36-50", value: 380 },
  { name: "51-65", value: 310 },
  { name: "65+", value: 240 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function AnalyticsDashboard() {
  const { toast } = useToast();
  const [timeframe, setTimeframe] = useState("year");
  const [activeTab, setActiveTab] = useState("visits");

  const handleRefreshData = () => {
    toast({
      title: "Data refreshed",
      description: "Analytics data has been updated.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export initiated",
      description: "Analytics data is being prepared for export.",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Analytics & Reporting
            </h1>
            <p className="text-muted-foreground">
              Data analysis and custom reporting
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <Select defaultValue="year" onValueChange={setTimeframe}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={handleRefreshData}>
              <Calendar className="mr-2 h-4 w-4" />
              Date Range
            </Button>

            <Button variant="outline" onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>

            <Button
              variant="outline"
              onClick={() => toast({ title: "Generating report" })}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>

            <Button
              variant="outline"
              onClick={() => toast({ title: "Sharing report" })}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Patients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">11,580</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">↑ 12%</span> from last year
              </p>
              <div className="mt-3 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-1 bg-primary" style={{ width: "77%" }}></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,870</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">↑ 18%</span> from last year
              </p>
              <div className="mt-3 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-1 bg-blue-500" style={{ width: "85%" }}></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Procedures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5,940</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">↑ 8%</span> from last year
              </p>
              <div className="mt-3 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-1 bg-yellow-500"
                  style={{ width: "65%" }}
                ></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Patient Satisfaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.7/5.0</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">↑ 0.3</span> from last year
              </p>
              <div className="mt-3 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-1 bg-green-500"
                  style={{ width: "94%" }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="visits" className="flex items-center">
                <BarChart className="mr-2 h-4 w-4" />
                Department Visits
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center">
                <LineIcon className="mr-2 h-4 w-4" />
                Annual Trends
              </TabsTrigger>
              <TabsTrigger value="demographics" className="flex items-center">
                <PieChartIcon className="mr-2 h-4 w-4" />
                Demographics
              </TabsTrigger>
            </TabsList>

            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          <TabsContent value="visits" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Department Visit Analysis</CardTitle>
                <CardDescription>
                  Visit types by department for{" "}
                  {timeframe === "year"
                    ? "this year"
                    : timeframe === "quarter"
                    ? "this quarter"
                    : "this month"}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={mockVisitData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="department"
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis
                      label={{
                        value: "Number of Visits",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} />
                    <Bar dataKey="scheduled" name="Scheduled" fill="#8884d8" />
                    <Bar dataKey="emergency" name="Emergency" fill="#ff6384" />
                    <Bar dataKey="walkin" name="Walk-in" fill="#4bc0c0" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Annual Performance Trends</CardTitle>
                <CardDescription>
                  Monthly trends for patients, appointments and procedures
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={mockTrendData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis
                      label={{
                        value: "Count",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} />
                    <Line
                      type="monotone"
                      dataKey="patients"
                      name="Unique Patients"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="appointments"
                      name="Appointments"
                      stroke="#4bc0c0"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="procedures"
                      name="Procedures"
                      stroke="#ff6384"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="demographics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Patient Demographics</CardTitle>
                <CardDescription>Age distribution of patients</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockPatientDemographics}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mockPatientDemographics.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} patients`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Custom Reports</CardTitle>
            <CardDescription>
              Generate and schedule custom reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    Department Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Performance metrics by department including patient flow,
                    revenue, and resource utilization
                  </p>
                  <Button size="sm" className="w-full">
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    Patient Demographics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Detailed analysis of patient demographics, geographic
                    distribution, and visit patterns
                  </p>
                  <Button size="sm" className="w-full">
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Financial Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Comprehensive financial report including revenue, expenses,
                    and profitability analysis
                  </p>
                  <Button size="sm" className="w-full">
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
