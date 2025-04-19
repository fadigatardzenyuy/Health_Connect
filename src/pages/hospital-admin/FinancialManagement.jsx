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
  CreditCard,
  Printer,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Users,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock financial data
const mockRevenueData = [
  { month: "Jan", revenue: 125000, expenses: 95000, profit: 30000 },
  { month: "Feb", revenue: 118000, expenses: 92000, profit: 26000 },
  { month: "Mar", revenue: 135000, expenses: 98000, profit: 37000 },
  { month: "Apr", revenue: 142000, expenses: 100000, profit: 42000 },
  { month: "May", revenue: 155000, expenses: 105000, profit: 50000 },
  { month: "Jun", revenue: 162000, expenses: 110000, profit: 52000 },
  { month: "Jul", revenue: 170000, expenses: 112000, profit: 58000 },
  { month: "Aug", revenue: 175000, expenses: 115000, profit: 60000 },
  { month: "Sep", revenue: 168000, expenses: 113000, profit: 55000 },
  { month: "Oct", revenue: 172000, expenses: 114000, profit: 58000 },
  { month: "Nov", revenue: 180000, expenses: 118000, profit: 62000 },
  { month: "Dec", revenue: 195000, expenses: 125000, profit: 70000 },
];

const mockDepartmentRevenue = [
  { name: "Cardiology", value: 285000 },
  { name: "Orthopedics", value: 220000 },
  { name: "Pediatrics", value: 185000 },
  { name: "Neurology", value: 175000 },
  { name: "Emergency", value: 210000 },
  { name: "Others", value: 425000 },
];

const mockBillingData = [
  {
    id: "INV-10341",
    patient: "Clara Johnson",
    department: "Cardiology",
    amount: 1250,
    status: "paid",
    date: "2025-04-09",
  },
  {
    id: "INV-10342",
    patient: "Samuel Ndong",
    department: "Orthopedics",
    amount: 950,
    status: "pending",
    date: "2025-04-09",
  },
  {
    id: "INV-10343",
    patient: "Elizabeth Fombu",
    department: "Pediatrics",
    amount: 550,
    status: "pending",
    date: "2025-04-08",
  },
  {
    id: "INV-10344",
    patient: "Peter Akum",
    department: "Cardiology",
    amount: 1450,
    status: "paid",
    date: "2025-04-08",
  },
  {
    id: "INV-10345",
    patient: "Mary Achu",
    department: "Neurology",
    amount: 1750,
    status: "overdue",
    date: "2025-04-07",
  },
];

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

export default function FinancialManagement() {
  const { toast } = useToast();
  const [timeframe, setTimeframe] = useState("year");
  const [activeTab, setActiveTab] = useState("overview");

  const handleRefreshData = () => {
    toast({
      title: "Data refreshed",
      description: "Financial data has been updated.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export initiated",
      description: "Financial data is being prepared for export.",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Financial Management
            </h1>
            <p className="text-muted-foreground">
              Monitor revenue, expenses, and financial metrics
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
              onClick={() => toast({ title: "Printing financial report" })}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1.89M</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-500 font-medium">12%</span>
                <span className="ml-1">from last year</span>
              </p>
              <div className="mt-3 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-1 bg-green-500"
                  style={{ width: `75%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Expenses
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1.26M</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="mr-1 h-4 w-4 text-amber-500" />
                <span className="text-amber-500 font-medium">8%</span>
                <span className="ml-1">from last year</span>
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
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$630K</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-500 font-medium">18%</span>
                <span className="ml-1">from last year</span>
              </p>
              <div className="mt-3 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-1 bg-green-500"
                  style={{ width: `85%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Outstanding Bills
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$85.4K</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingDown className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-500 font-medium">5%</span>
                <span className="ml-1">from last month</span>
              </p>
              <div className="mt-3 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-1 bg-blue-500" style={{ width: `35%` }}></div>
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
              <TabsTrigger value="overview" className="flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                Revenue Overview
              </TabsTrigger>
              <TabsTrigger value="departments" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                By Department
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center">
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </TabsTrigger>
            </TabsList>

            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Annual Revenue & Expenses</CardTitle>
                <CardDescription>
                  Monthly financial performance for the current year
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={mockRevenueData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis
                      label={{
                        value: "Amount ($)",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip
                      formatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="expenses"
                      name="Expenses"
                      stroke="#ff6384"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      name="Profit"
                      stroke="#4bc0c0"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Department</CardTitle>
                <CardDescription>
                  Financial contribution of each department
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockDepartmentRevenue}
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
                      {mockDepartmentRevenue.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Billing</CardTitle>
                <CardDescription>
                  Recent patient invoices and payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium">Invoice</th>
                        <th className="text-left p-3 font-medium">Patient</th>
                        <th className="text-left p-3 font-medium">
                          Department
                        </th>
                        <th className="text-left p-3 font-medium">Amount</th>
                        <th className="text-left p-3 font-medium">Date</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockBillingData.map((item) => {
                        let statusColor =
                          "bg-green-100 text-green-800 border-green-200";
                        if (item.status === "pending") {
                          statusColor =
                            "bg-amber-100 text-amber-800 border-amber-200";
                        } else if (item.status === "overdue") {
                          statusColor =
                            "bg-red-100 text-red-800 border-red-200";
                        }

                        return (
                          <tr key={item.id} className="border-t">
                            <td className="p-3 font-medium">{item.id}</td>
                            <td className="p-3">{item.patient}</td>
                            <td className="p-3">{item.department}</td>
                            <td className="p-3">
                              ${item.amount.toLocaleString()}
                            </td>
                            <td className="p-3">
                              {new Date(item.date).toLocaleDateString()}
                            </td>
                            <td className="p-3">
                              <Badge variant="outline" className={statusColor}>
                                {item.status.charAt(0).toUpperCase() +
                                  item.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  View
                                </Button>
                                <Button variant="outline" size="sm">
                                  Print
                                </Button>
                              </div>
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
