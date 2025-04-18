import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Activity,
  Building,
  Calendar,
  CreditCard,
  MessageSquare,
  Settings2,
  Users,
  Bell,
  Clock,
  TrendingUp,
  Bed,
  Stethoscope,
  LineChart,
  ArrowRight,
  BarChart4,
  AlertTriangle,
  ShieldAlert,
  Thermometer,
} from "lucide-react";

// Dashboard module configuration
const dashboardModules = [
  {
    id: "overview",
    title: "Hospital Overview",
    description: "Key hospital performance indicators and metrics",
    icon: Activity,
    link: "/hospital-admin",
    stats: { value: "185/240", label: "Beds Occupied", percent: 77 },
    color: "bg-blue-50 text-blue-700 border-blue-100",
  },
  {
    id: "departments",
    title: "Department Management",
    description: "Manage hospital departments and structure",
    icon: Building,
    link: "/hospital-admin/departments",
    stats: { value: "8", label: "Active Departments", percent: 100 },
    color: "bg-purple-50 text-purple-700 border-purple-100",
  },
  {
    id: "staff",
    title: "Staff Management",
    description: "Manage doctors, nurses and medical staff",
    icon: Users,
    link: "/hospital-admin/staff",
    stats: { value: "156", label: "Active Staff", percent: 92 },
    color: "bg-green-50 text-green-700 border-green-100",
  },
  {
    id: "appointments",
    title: "Appointments Management",
    description: "View and manage hospital appointments",
    icon: Calendar,
    link: "/hospital-admin/appointments",
    stats: { value: "28", label: "Today's Appointments", percent: 85 },
    color: "bg-yellow-50 text-yellow-700 border-yellow-100",
  },
  {
    id: "occupancy",
    title: "Department Occupancy",
    description: "Monitor bed utilization and availability",
    icon: Bed,
    link: "/hospital-admin/occupancy",
    stats: { value: "77%", label: "Overall Occupancy", percent: 77 },
    color: "bg-indigo-50 text-indigo-700 border-indigo-100",
    badge: "Real-time",
  },
  {
    id: "scheduling",
    title: "Resource Scheduling",
    description: "Schedule rooms, equipment and facilities",
    icon: Clock,
    link: "/hospital-admin/scheduling",
    stats: { value: "12/15", label: "Operating Rooms Booked", percent: 80 },
    color: "bg-pink-50 text-pink-700 border-pink-100",
  },
  {
    id: "patient-flow",
    title: "Patient Flow Analysis",
    description: "Analyze patient journey and wait times",
    icon: TrendingUp,
    link: "/hospital-admin/patient-flow",
    stats: { value: "32 min", label: "Avg. Wait Time", percent: 65 },
    color: "bg-orange-50 text-orange-700 border-orange-100",
    badge: "New",
  },
  {
    id: "financial",
    title: "Financial Management",
    description: "Monitor revenue, expenses, and metrics",
    icon: CreditCard,
    link: "/hospital-admin/financial",
    stats: { value: "$1.89M", label: "Annual Revenue", percent: 92 },
    color: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  {
    id: "analytics",
    title: "Analytics & Reporting",
    description: "Custom reports and data analysis",
    icon: BarChart4,
    link: "/hospital-admin/analytics",
    stats: { value: "4.7/5.0", label: "Patient Satisfaction", percent: 94 },
    color: "bg-cyan-50 text-cyan-700 border-cyan-100",
  },
  {
    id: "communication",
    title: "Communication Center",
    description: "Hospital-wide messages and alerts",
    icon: MessageSquare,
    link: "/hospital-admin/messages",
    stats: { value: "3", label: "Unread Messages", percent: 30 },
    color: "bg-teal-50 text-teal-700 border-teal-100",
  },
  {
    id: "settings",
    title: "System Settings",
    description: "Configure hospital system settings",
    icon: Settings2,
    link: "/hospital-admin/settings",
    stats: { value: "Complete", label: "Configuration Status", percent: 100 },
    color: "bg-gray-50 text-gray-700 border-gray-100",
  },
];

// Main Hospital Admin Dashboard
export function HospitalAdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // For demo purposes only: redirect to onboarding if coming directly to dashboard
  //   useEffect(() => {
  //     const hasCompletedOnboarding = localStorage.getItem("onboardingComplete");
  //     if (!hasCompletedOnboarding) {
  //       toast({
  //         title: "Onboarding Required",
  //         description: "Please complete the hospital setup process first.",
  //       });
  //       navigate("/onboarding");
  //     }
  //   }, [navigate, toast]);

  // Mock alert notifications
  const notifications = [
    {
      id: 1,
      title: "Critical staff shortage in ER",
      priority: "high",
      icon: ShieldAlert,
    },
    {
      id: 2,
      title: "System maintenance scheduled",
      priority: "medium",
      icon: Settings2,
    },
    {
      id: 3,
      title: "New policy updates available",
      priority: "low",
      icon: Bell,
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Hospital Administration
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || "Administrator"}. Here's what's
            happening today.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {notifications.map((notification) => (
            <Button
              key={notification.id}
              variant={
                notification.priority === "high"
                  ? "destructive"
                  : notification.priority === "medium"
                  ? "default"
                  : "outline"
              }
              size="sm"
              className="relative"
            >
              <notification.icon className="h-4 w-4 mr-2" />
              {notification.priority === "high" && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
              {notification.title}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Activity className="h-5 w-5 mr-2 text-primary" />
              Hospital Status
            </CardTitle>
            <CardDescription>Current operational status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Bed Capacity
                  </p>
                  <p className="text-sm font-medium">185/240</p>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-primary rounded-full"
                    style={{ width: "77%" }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  77% occupancy
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Staff Present
                  </p>
                  <p className="text-sm font-medium">156/168</p>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-green-500 rounded-full"
                    style={{ width: "93%" }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  93% attendance rate
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Critical Resources
                  </p>
                  <p className="text-sm font-medium">92%</p>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-yellow-500 rounded-full"
                    style={{ width: "92%" }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  8% shortage in supplies
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              Today's Schedule
            </CardTitle>
            <CardDescription>Key events for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
              <p className="text-sm flex-1">28 Patient Appointments</p>
              <Badge
                variant="outline"
                className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
              >
                Today
              </Badge>
            </div>
            <div className="flex items-center p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              <p className="text-sm flex-1">4 Surgeries Scheduled</p>
              <Badge
                variant="outline"
                className="ml-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
              >
                09:00
              </Badge>
            </div>
            <div className="flex items-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
              <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
              <p className="text-sm flex-1">2 Staff Meetings</p>
              <Badge
                variant="outline"
                className="ml-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
              >
                13:00
              </Badge>
            </div>
            <div className="flex items-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-md">
              <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
              <p className="text-sm flex-1">Equipment Maintenance</p>
              <Badge
                variant="outline"
                className="ml-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
              >
                15:30
              </Badge>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link
                to="/hospital-admin/appointments"
                className="flex items-center justify-center"
              >
                <span>View Full Schedule</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
              Critical Alerts
            </CardTitle>
            <CardDescription>Items requiring attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
              <Badge variant="destructive" className="mt-0.5 text-[10px] h-5">
                Critical
              </Badge>
              <div>
                <p className="text-sm font-medium">ER staff shortage</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  2 nurses needed for evening shift
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
              <Badge variant="destructive" className="mt-0.5 text-[10px] h-5">
                Critical
              </Badge>
              <div>
                <p className="text-sm font-medium">Blood supply low</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Type O- urgently needed
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-md">
              <Badge className="mt-0.5 bg-amber-100 text-amber-800 hover:bg-amber-100 text-[10px] h-5">
                Medium
              </Badge>
              <div>
                <p className="text-sm font-medium">Doctor certifications</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  5 certifications expiring soon
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-md">
              <Badge className="mt-0.5 bg-amber-100 text-amber-800 hover:bg-amber-100 text-[10px] h-5">
                Medium
              </Badge>
              <div>
                <p className="text-sm font-medium">MRI maintenance</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Scheduled for next week
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center"
            >
              <span>View All Alerts</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <h2 className="text-xl font-semibold tracking-tight mt-8 mb-4 text-gray-900 dark:text-white flex items-center">
        <Thermometer className="h-5 w-5 mr-2 text-primary" />
        Hospital Administration Modules
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardModules.map((module) => (
          <Card
            key={module.id}
            className="overflow-hidden hover:shadow-md transition-shadow group"
          >
            <CardHeader className={`pb-2 ${module.color}`}>
              <div className="flex justify-between">
                <CardTitle className="flex items-center text-lg">
                  <module.icon className="h-5 w-5 mr-2" />
                  {module.title}
                </CardTitle>
                {module.badge && (
                  <Badge
                    variant="outline"
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                  >
                    {module.badge}
                  </Badge>
                )}
              </div>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                {module.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-2xl font-bold">{module.stats.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {module.stats.label}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 group-hover:bg-primary group-hover:text-white transition-colors">
                  <module.icon className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-white transition-colors" />
                </div>
              </div>
              <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-2 ${
                    module.id === "patient-flow" ? "bg-amber-500" : "bg-primary"
                  } rounded-full`}
                  style={{ width: `${module.stats.percent}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {module.stats.percent}% complete
              </p>
            </CardContent>
            <CardFooter className="pt-2 pb-4">
              <Button
                asChild
                className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
              >
                <Link
                  to={module.link}
                  className="flex items-center justify-center"
                >
                  <span>Open Dashboard</span>
                  <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
