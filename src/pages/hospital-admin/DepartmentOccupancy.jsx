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
import { BarChart, Calendar, Download, Filter, RefreshCw } from "lucide-react";
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
} from "recharts";

const mockOccupancyData = [
  { name: "Cardiology", totalBeds: 60, occupiedBeds: 48, availableBeds: 12 },
  { name: "Pediatrics", totalBeds: 50, occupiedBeds: 32, availableBeds: 18 },
  { name: "Neurology", totalBeds: 40, occupiedBeds: 35, availableBeds: 5 },
  { name: "Orthopedics", totalBeds: 45, occupiedBeds: 38, availableBeds: 7 },
  { name: "Emergency", totalBeds: 30, occupiedBeds: 25, availableBeds: 5 },
  { name: "Oncology", totalBeds: 55, occupiedBeds: 42, availableBeds: 13 },
  { name: "Psychiatry", totalBeds: 35, occupiedBeds: 20, availableBeds: 15 },
  { name: "Radiology", totalBeds: 25, occupiedBeds: 10, availableBeds: 15 },
];

const mockTrendData = [
  {
    day: "Mon",
    Cardiology: 85,
    Pediatrics: 75,
    Neurology: 65,
    Orthopedics: 62,
    Emergency: 90,
    Oncology: 78,
  },
  {
    day: "Tue",
    Cardiology: 80,
    Pediatrics: 65,
    Neurology: 70,
    Orthopedics: 75,
    Emergency: 85,
    Oncology: 80,
  },
  {
    day: "Wed",
    Cardiology: 75,
    Pediatrics: 68,
    Neurology: 85,
    Orthopedics: 78,
    Emergency: 82,
    Oncology: 75,
  },
  {
    day: "Thu",
    Cardiology: 82,
    Pediatrics: 70,
    Neurology: 75,
    Orthopedics: 80,
    Emergency: 88,
    Oncology: 73,
  },
  {
    day: "Fri",
    Cardiology: 90,
    Pediatrics: 72,
    Neurology: 80,
    Orthopedics: 82,
    Emergency: 92,
    Oncology: 81,
  },
  {
    day: "Sat",
    Cardiology: 75,
    Pediatrics: 60,
    Neurology: 70,
    Orthopedics: 70,
    Emergency: 85,
    Oncology: 70,
  },
  {
    day: "Sun",
    Cardiology: 70,
    Pediatrics: 55,
    Neurology: 65,
    Orthopedics: 65,
    Emergency: 80,
    Oncology: 65,
  },
];

const colors = {
  occupiedBeds: "#8884d8",
  availableBeds: "#82ca9d",
};

const departmentColors = {
  Cardiology: "#8884d8",
  Pediatrics: "#82ca9d",
  Neurology: "#ffc658",
  Orthopedics: "#ff8042",
  Emergency: "#0088fe",
  Oncology: "#00C49F",
};

const summaryStats = {
  totalBeds: 340,
  occupiedBeds: 250,
  availableBeds: 90,
  occupancyRate: 73.5,
  criticalDepartments: ["Neurology", "Emergency"],
  lowOccupancyDepartments: ["Psychiatry", "Radiology"],
};

export default function DepartmentOccupancy() {
  const { toast } = useToast();
  const [view, setView] = useState("current");
  const [timeframe, setTimeframe] = useState("daily");

  const handleExportData = () => {
    toast({
      title: "Export initiated",
      description: "Occupancy data is being prepared for export.",
    });
  };

  const handleRefreshData = () => {
    toast({
      title: "Data refreshed",
      description: "Occupancy data has been updated.",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Department Occupancy
            </h1>
            <p className="text-muted-foreground">
              Current bed utilization by department
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <Select defaultValue="daily">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
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
                Total Bed Capacity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.totalBeds}</div>
              <p className="text-xs text-muted-foreground">
                Across all departments
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Occupied Beds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summaryStats.occupiedBeds}
              </div>
              <p className="text-xs text-muted-foreground">
                {summaryStats.occupancyRate}% occupancy rate
              </p>
              <div className="mt-3 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-1 bg-blue-500"
                  style={{ width: `${summaryStats.occupancyRate}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Available Beds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summaryStats.availableBeds}
              </div>
              <p className="text-xs text-muted-foreground">
                {(100 - summaryStats.occupancyRate).toFixed(1)}% availability
              </p>
              <div className="mt-3 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-1 bg-green-500"
                  style={{ width: `${100 - summaryStats.occupancyRate}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Critical Departments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summaryStats.criticalDepartments.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {summaryStats.criticalDepartments.join(", ")}
              </p>
              <div className="mt-3 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-1 bg-red-500"
                  style={{
                    width: `${
                      (summaryStats.criticalDepartments.length /
                        mockOccupancyData.length) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bar" className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="bar" className="flex items-center">
                <BarChart className="mr-2 h-4 w-4" />
                Bar Chart
              </TabsTrigger>
              <TabsTrigger value="trend" className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                Weekly Trend
              </TabsTrigger>
            </TabsList>

            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter Departments
            </Button>
          </div>

          <TabsContent value="bar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Department Occupancy</CardTitle>
                <CardDescription>
                  Current bed utilization by department
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={mockOccupancyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis
                      label={{
                        value: "Number of Beds",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} />
                    <Bar
                      dataKey="occupiedBeds"
                      name="Occupied Beds"
                      stackId="a"
                      fill={colors.occupiedBeds}
                    />
                    <Bar
                      dataKey="availableBeds"
                      name="Available Beds"
                      stackId="a"
                      fill={colors.availableBeds}
                    />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trend" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Occupancy Trend</CardTitle>
                <CardDescription>
                  Percentage occupancy by department over the last week
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={mockTrendData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis
                      label={{
                        value: "Occupancy %",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} />
                    {Object.entries(departmentColors).map(([dept, color]) => (
                      <Bar key={dept} dataKey={dept} fill={color} />
                    ))}
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Department-wise Occupancy Details</CardTitle>
            <CardDescription>
              Detailed breakdown of bed utilization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-medium">Department</th>
                    <th className="text-left p-3 font-medium">Total Beds</th>
                    <th className="text-left p-3 font-medium">Occupied Beds</th>
                    <th className="text-left p-3 font-medium">
                      Available Beds
                    </th>
                    <th className="text-left p-3 font-medium">
                      Occupancy Rate
                    </th>
                    <th className="text-left p-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockOccupancyData.map((dept) => {
                    const occupancyRate =
                      (dept.occupiedBeds / dept.totalBeds) * 100;
                    let statusColor =
                      "bg-green-100 text-green-800 border-green-200";
                    let statusText = "Normal";

                    if (occupancyRate > 90) {
                      statusColor = "bg-red-100 text-red-800 border-red-200";
                      statusText = "Critical";
                    } else if (occupancyRate > 75) {
                      statusColor =
                        "bg-yellow-100 text-yellow-800 border-yellow-200";
                      statusText = "High";
                    } else if (occupancyRate < 40) {
                      statusColor = "bg-blue-100 text-blue-800 border-blue-200";
                      statusText = "Low";
                    }

                    return (
                      <tr key={dept.name} className="border-t">
                        <td className="p-3 font-medium">{dept.name}</td>
                        <td className="p-3">{dept.totalBeds}</td>
                        <td className="p-3">{dept.occupiedBeds}</td>
                        <td className="p-3">{dept.availableBeds}</td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <span className="mr-2">
                              {occupancyRate.toFixed(1)}%
                            </span>
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-2 ${
                                  occupancyRate > 90
                                    ? "bg-red-500"
                                    : occupancyRate > 75
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                }`}
                                style={{ width: `${occupancyRate}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className={statusColor}>
                            {statusText}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
