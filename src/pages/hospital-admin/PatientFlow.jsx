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
  RefreshCw,
  Users,
  Clock,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

// Mock patient flow data
const mockHourlyWaitTimes = [
  { hour: "8 AM", emergency: 45, outpatient: 25, inpatient: 10 },
  { hour: "9 AM", emergency: 55, outpatient: 30, inpatient: 12 },
  { hour: "10 AM", emergency: 40, outpatient: 35, inpatient: 15 },
  { hour: "11 AM", emergency: 30, outpatient: 40, inpatient: 15 },
  { hour: "12 PM", emergency: 35, outpatient: 45, inpatient: 10 },
  { hour: "1 PM", emergency: 40, outpatient: 30, inpatient: 12 },
  { hour: "2 PM", emergency: 45, outpatient: 25, inpatient: 14 },
  { hour: "3 PM", emergency: 50, outpatient: 20, inpatient: 15 },
  { hour: "4 PM", emergency: 45, outpatient: 30, inpatient: 12 },
  { hour: "5 PM", emergency: 35, outpatient: 25, inpatient: 10 },
];

const mockPatientFlow = [
  { time: "8 AM", checkedIn: 12, inService: 25, completed: 5 },
  { time: "9 AM", checkedIn: 18, inService: 30, completed: 12 },
  { time: "10 AM", checkedIn: 22, inService: 35, completed: 18 },
  { time: "11 AM", checkedIn: 20, inService: 40, completed: 25 },
  { time: "12 PM", checkedIn: 15, inService: 38, completed: 30 },
  { time: "1 PM", checkedIn: 18, inService: 35, completed: 32 },
  { time: "2 PM", checkedIn: 20, inService: 30, completed: 38 },
  { time: "3 PM", checkedIn: 15, inService: 28, completed: 40 },
  { time: "4 PM", checkedIn: 10, inService: 25, completed: 42 },
  { time: "5 PM", checkedIn: 5, inService: 15, completed: 45 },
];

const mockBottlenecks = [
  {
    id: 1,
    department: "Emergency Room",
    waitTime: 55,
    patients: 18,
    status: "critical",
  },
  {
    id: 2,
    department: "Laboratory",
    waitTime: 45,
    patients: 12,
    status: "high",
  },
  {
    id: 3,
    department: "Radiology",
    waitTime: 35,
    patients: 15,
    status: "medium",
  },
  {
    id: 4,
    department: "Pharmacy",
    waitTime: 25,
    patients: 20,
    status: "medium",
  },
  {
    id: 5,
    department: "Specialist Consultation",
    waitTime: 40,
    patients: 10,
    status: "high",
  },
];

const colors = {
  emergency: "#ff6384",
  outpatient: "#36a2eb",
  inpatient: "#4bc0c0",
  checkedIn: "#ff9f40",
  inService: "#8884d8",
  completed: "#82ca9d",
};

export default function PatientFlow() {
  const { toast } = useToast();
  const [timeframe, setTimeframe] = useState("today");
  const [activeTab, setActiveTab] = useState("wait-times");

  const handleRefreshData = () => {
    toast({
      title: "Data refreshed",
      description: "Patient flow data has been updated.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export initiated",
      description: "Patient flow data is being prepared for export.",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Patient Flow Analysis
            </h1>
            <p className="text-muted-foreground">
              Monitor patient journey touchpoints and identify bottlenecks
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <Select defaultValue="today" onValueChange={setTimeframe}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={handleRefreshData}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>

            <Button variant="outline" onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Wait Time
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32 min</div>
              <p className="text-xs text-muted-foreground">
                Average across all departments
              </p>
              <div className="mt-3 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-1 bg-amber-500"
                  style={{ width: `65%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Patients in Queue
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">84</div>
              <p className="text-xs text-muted-foreground">
                Across all departments
              </p>
              <div className="mt-3 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-1 bg-blue-500" style={{ width: `70%` }}></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Patient Throughput
              </CardTitle>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">
                Patients processed today
              </p>
              <div className="mt-3 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-1 bg-green-500"
                  style={{ width: `65%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Bottleneck Alerts
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                Emergency, Laboratory, Specialist
              </p>
              <div className="mt-3 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-1 bg-red-500" style={{ width: `30%` }}></div>
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
              <TabsTrigger value="wait-times" className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Wait Times
              </TabsTrigger>
              <TabsTrigger value="patient-flow" className="flex items-center">
                <ArrowRight className="mr-2 h-4 w-4" />
                Patient Flow
              </TabsTrigger>
              <TabsTrigger value="bottlenecks" className="flex items-center">
                <AlertCircle className="mr-2 h-4 w-4" />
                Bottlenecks
              </TabsTrigger>
            </TabsList>

            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter Departments
            </Button>
          </div>

          <TabsContent value="wait-times" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Wait Times by Department</CardTitle>
                <CardDescription>
                  Average patient wait time in minutes by hour
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={mockHourlyWaitTimes}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis
                      label={{
                        value: "Wait Time (minutes)",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} />
                    <Line
                      type="monotone"
                      dataKey="emergency"
                      name="Emergency"
                      stroke={colors.emergency}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="outpatient"
                      name="Outpatient"
                      stroke={colors.outpatient}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="inpatient"
                      name="Inpatient"
                      stroke={colors.inpatient}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patient-flow" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Patient Flow Visualization</CardTitle>
                <CardDescription>
                  Number of patients at each stage of their journey by hour
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={mockPatientFlow}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis
                      label={{
                        value: "Number of Patients",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} />
                    <Area
                      type="monotone"
                      dataKey="checkedIn"
                      name="Checked In"
                      stackId="1"
                      fill={colors.checkedIn}
                      stroke={colors.checkedIn}
                    />
                    <Area
                      type="monotone"
                      dataKey="inService"
                      name="In Service"
                      stackId="1"
                      fill={colors.inService}
                      stroke={colors.inService}
                    />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      name="Completed"
                      stackId="1"
                      fill={colors.completed}
                      stroke={colors.completed}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bottlenecks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Bottlenecks</CardTitle>
                <CardDescription>
                  Departments with the highest wait times and patient loads
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium">
                          Department
                        </th>
                        <th className="text-left p-3 font-medium">
                          Avg. Wait Time
                        </th>
                        <th className="text-left p-3 font-medium">
                          Patients Waiting
                        </th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockBottlenecks.map((item) => {
                        let statusColor =
                          "bg-green-100 text-green-800 border-green-200";
                        if (item.status === "critical") {
                          statusColor =
                            "bg-red-100 text-red-800 border-red-200";
                        } else if (item.status === "high") {
                          statusColor =
                            "bg-yellow-100 text-yellow-800 border-yellow-200";
                        } else if (item.status === "medium") {
                          statusColor =
                            "bg-amber-100 text-amber-800 border-amber-200";
                        }

                        return (
                          <tr key={item.id} className="border-t">
                            <td className="p-3 font-medium">
                              {item.department}
                            </td>
                            <td className="p-3">{item.waitTime} min</td>
                            <td className="p-3">{item.patients}</td>
                            <td className="p-3">
                              <Badge variant="outline" className={statusColor}>
                                {item.status.charAt(0).toUpperCase() +
                                  item.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
