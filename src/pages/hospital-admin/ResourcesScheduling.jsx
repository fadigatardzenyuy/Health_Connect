import { useState } from "react";
import { AdminLayout } from "@/components/hospital-admin/AdminLayout";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Calendar as CalendarIcon,
  Filter,
  Clock,
  Bed,
  CalendarDays,
  Building2,
  MoreHorizontal,
  UserPlus,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

const resourceTypes = [
  { id: "beds", name: "Beds", icon: Bed },
  { id: "operating-rooms", name: "Operating Rooms", icon: Building2 },
  { id: "equipment", name: "Medical Equipment", icon: Clock },
];

// Mock appointments data
const appointments = [
  {
    id: "apt-1",
    patientName: "Clara Johnson",
    patientId: "PT-24578",
    department: "Cardiology",
    doctor: "Dr. Michael Stevens",
    date: "2025-04-10",
    time: "09:30 AM",
    duration: 30,
    room: "Room 102",
    status: "confirmed",
    priority: "normal",
  },
  {
    id: "apt-2",
    patientName: "Samuel Ndong",
    patientId: "PT-24579",
    department: "Orthopedics",
    doctor: "Dr. Sarah Nkeng",
    date: "2025-04-10",
    time: "11:00 AM",
    duration: 45,
    room: "Room 210",
    status: "confirmed",
    priority: "normal",
  },
  {
    id: "apt-3",
    patientName: "Elizabeth Fombu",
    patientId: "PT-24580",
    department: "General Medicine",
    doctor: "Dr. James Tabe",
    date: "2025-04-11",
    time: "10:15 AM",
    duration: 30,
    room: "Room 105",
    status: "pending",
    priority: "normal",
  },
  {
    id: "apt-4",
    patientName: "Peter Akum",
    patientId: "PT-24581",
    department: "Pediatrics",
    doctor: "Dr. Linda Mbaku",
    date: "2025-04-09",
    time: "02:30 PM",
    duration: 30,
    room: "Room 305",
    status: "completed",
    priority: "normal",
  },
  {
    id: "apt-5",
    patientName: "Mary Achu",
    patientId: "PT-24582",
    department: "Dermatology",
    doctor: "Dr. Robert Enow",
    date: "2025-04-12",
    time: "03:45 PM",
    duration: 30,
    room: "Room 207",
    status: "confirmed",
    priority: "high",
  },
  {
    id: "apt-6",
    patientName: "John Tatah",
    patientId: "PT-24583",
    department: "Cardiology",
    doctor: "Dr. Michael Stevens",
    date: "2025-04-10",
    time: "12:30 PM",
    duration: 60,
    room: "Room 103",
    status: "confirmed",
    priority: "urgent",
  },
];

// Mock resource data
const resourceAllocations = [
  {
    id: "bed-101",
    name: "Bed 101",
    type: "beds",
    department: "Cardiology",
    floor: "First Floor",
    wing: "East Wing",
    status: "occupied",
    patient: "Clara Johnson (PT-24578)",
    estimatedRelease: "2025-04-15",
  },
  {
    id: "bed-102",
    name: "Bed 102",
    type: "beds",
    department: "Cardiology",
    floor: "First Floor",
    wing: "East Wing",
    status: "available",
    patient: null,
    estimatedRelease: null,
  },
  {
    id: "OR-1",
    name: "Operating Room 1",
    type: "operating-rooms",
    department: "Surgery",
    floor: "Second Floor",
    wing: "Main Wing",
    status: "scheduled",
    patient: "John Tatah (PT-24583)",
    estimatedRelease: "2025-04-10 14:30",
  },
  {
    id: "OR-2",
    name: "Operating Room 2",
    type: "operating-rooms",
    department: "Surgery",
    floor: "Second Floor",
    wing: "Main Wing",
    status: "available",
    patient: null,
    estimatedRelease: null,
  },
  {
    id: "EQ-MRI-1",
    name: "MRI Scanner 1",
    type: "equipment",
    department: "Radiology",
    floor: "Ground Floor",
    wing: "West Wing",
    status: "maintenance",
    patient: null,
    estimatedRelease: "2025-04-11",
  },
  {
    id: "EQ-XRAY-1",
    name: "X-Ray Machine 1",
    type: "equipment",
    department: "Radiology",
    floor: "Ground Floor",
    wing: "West Wing",
    status: "available",
    patient: null,
    estimatedRelease: null,
  },
];

export default function ResourceScheduling() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("appointments");
  const [date, setDate] = useState();
  const [resourceType, setResourceType] = useState("all");

  // Filter appointments based on tab and search
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      searchQuery === "" ||
      appointment.patientName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      appointment.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      (activeTab === "upcoming" &&
        ["confirmed", "pending"].includes(appointment.status)) ||
      (activeTab === "completed" && appointment.status === "completed") ||
      (activeTab === "cancelled" && appointment.status === "cancelled") ||
      activeTab === "appointments";

    return matchesSearch && matchesTab;
  });

  // Filter resources based on search and resource type
  const filteredResources = resourceAllocations.filter((resource) => {
    const matchesSearch =
      searchQuery === "" ||
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resource.patient &&
        resource.patient.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType =
      resourceType === "all" || resource.type === resourceType;

    return matchesSearch && matchesType;
  });

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleRefresh = () => {
    toast({
      title: "Data refreshed",
      description: "Resource allocations have been updated.",
    });
  };

  const handleNewAppointment = () => {
    toast({
      title: "Create Appointment",
      description: "Navigate to appointment creation form.",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "occupied":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "available":
        return "bg-green-100 text-green-800 border-green-200";
      case "scheduled":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "maintenance":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "normal":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Appointment & Resource Scheduling
            </h1>
            <p className="text-muted-foreground">
              Manage appointments and resource allocation
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={
                    activeTab === "appointments"
                      ? "Search appointments..."
                      : "Search resources..."
                  }
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit">Search</Button>
            </form>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[240px] pl-3 text-left font-normal"
                >
                  {date ? format(date, "PPP") : <span>Select a date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>

            <Button onClick={handleNewAppointment}>
              <UserPlus className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          </div>
        </div>

        <Tabs
          defaultValue="appointments"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="appointments" className="flex items-center">
              <CalendarDays className="mr-2 h-4 w-4" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center">
              <Building2 className="mr-2 h-4 w-4" />
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Hospital Appointments</CardTitle>
                    <CardDescription>
                      {date
                        ? `Appointments for ${format(date, "PPP")}`
                        : "All upcoming appointments"}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Calendar View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <Tabs defaultValue="upcoming" className="px-4">
                <TabsList className="mb-4">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                  <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming">
                  <CardContent className="p-0 pb-4">
                    <div className="rounded-md border overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="text-left p-3 font-medium">
                                Patient
                              </th>
                              <th className="text-left p-3 font-medium">
                                Department
                              </th>
                              <th className="text-left p-3 font-medium">
                                Doctor
                              </th>
                              <th className="text-left p-3 font-medium">
                                Date & Time
                              </th>
                              <th className="text-left p-3 font-medium">
                                Room
                              </th>
                              <th className="text-left p-3 font-medium">
                                Status
                              </th>
                              <th className="text-left p-3 font-medium">
                                Priority
                              </th>
                              <th className="text-left p-3 font-medium">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredAppointments.length === 0 ? (
                              <tr>
                                <td
                                  colSpan={8}
                                  className="p-4 text-center text-muted-foreground"
                                >
                                  No appointments found
                                </td>
                              </tr>
                            ) : (
                              filteredAppointments.map((appointment) => (
                                <tr key={appointment.id} className="border-t">
                                  <td className="p-3">
                                    <div>
                                      <div className="font-medium">
                                        {appointment.patientName}
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        {appointment.patientId}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-3">
                                    {appointment.department}
                                  </td>
                                  <td className="p-3">{appointment.doctor}</td>
                                  <td className="p-3">
                                    <div>
                                      <div>
                                        {new Date(
                                          appointment.date
                                        ).toLocaleDateString()}
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        {appointment.time} (
                                        {appointment.duration} min)
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-3">{appointment.room}</td>
                                  <td className="p-3">
                                    <Badge
                                      variant="outline"
                                      className={getStatusColor(
                                        appointment.status
                                      )}
                                    >
                                      {appointment.status
                                        .charAt(0)
                                        .toUpperCase() +
                                        appointment.status.slice(1)}
                                    </Badge>
                                  </td>
                                  <td className="p-3">
                                    <Badge
                                      variant="outline"
                                      className={getPriorityColor(
                                        appointment.priority
                                      )}
                                    >
                                      {appointment.priority
                                        .charAt(0)
                                        .toUpperCase() +
                                        appointment.priority.slice(1)}
                                    </Badge>
                                  </td>
                                  <td className="p-3">
                                    <div className="flex gap-2">
                                      <Button variant="outline" size="sm">
                                        View
                                      </Button>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="sm">
                                            <MoreHorizontal className="h-4 w-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuLabel>
                                            Actions
                                          </DropdownMenuLabel>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem>
                                            Edit
                                          </DropdownMenuItem>
                                          <DropdownMenuItem>
                                            Reschedule
                                          </DropdownMenuItem>
                                          <DropdownMenuItem className="text-red-600">
                                            Cancel
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </TabsContent>

                <TabsContent value="completed">
                  <CardContent className="p-0 pb-4 text-center py-10 text-muted-foreground">
                    Change the tab to view different appointment categories
                  </CardContent>
                </TabsContent>

                <TabsContent value="cancelled">
                  <CardContent className="p-0 pb-4 text-center py-10 text-muted-foreground">
                    Change the tab to view different appointment categories
                  </CardContent>
                </TabsContent>

                <TabsContent value="all">
                  <CardContent className="p-0 pb-4 text-center py-10 text-muted-foreground">
                    Change the tab to view different appointment categories
                  </CardContent>
                </TabsContent>
              </Tabs>

              <CardFooter className="border-t bg-muted/10 py-3">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredAppointments.length} of {appointments.length}{" "}
                  appointments
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Resource Allocation</CardTitle>
                    <CardDescription>
                      Hospital resources and their current status
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={resourceType}
                      onValueChange={setResourceType}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Resource Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Resources</SelectItem>
                        <SelectItem value="beds">Beds</SelectItem>
                        <SelectItem value="operating-rooms">
                          Operating Rooms
                        </SelectItem>
                        <SelectItem value="equipment">
                          Medical Equipment
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0 pb-0">
                <div className="p-4 pb-0">
                  <div className="grid gap-4 md:grid-cols-3 mb-4">
                    {resourceTypes.map((type) => (
                      <Card
                        key={type.id}
                        className={`${
                          resourceType === type.id
                            ? "border-primary bg-primary/5"
                            : ""
                        }`}
                      >
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-base flex items-center">
                            <type.icon className="mr-2 h-5 w-5 text-primary" />
                            {type.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <p className="text-muted-foreground">Total</p>
                              <p className="font-medium">
                                {
                                  resourceAllocations.filter(
                                    (r) => r.type === type.id
                                  ).length
                                }
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Available</p>
                              <p className="font-medium">
                                {
                                  resourceAllocations.filter(
                                    (r) =>
                                      r.type === type.id &&
                                      r.status === "available"
                                  ).length
                                }
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Occupied</p>
                              <p className="font-medium">
                                {
                                  resourceAllocations.filter(
                                    (r) =>
                                      r.type === type.id &&
                                      r.status !== "available"
                                  ).length
                                }
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="rounded-md border overflow-hidden mx-4 mb-4">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-3 font-medium">ID</th>
                          <th className="text-left p-3 font-medium">Name</th>
                          <th className="text-left p-3 font-medium">Type</th>
                          <th className="text-left p-3 font-medium">
                            Department
                          </th>
                          <th className="text-left p-3 font-medium">
                            Location
                          </th>
                          <th className="text-left p-3 font-medium">Status</th>
                          <th className="text-left p-3 font-medium">Patient</th>
                          <th className="text-left p-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredResources.length === 0 ? (
                          <tr>
                            <td
                              colSpan={8}
                              className="p-4 text-center text-muted-foreground"
                            >
                              No resources found
                            </td>
                          </tr>
                        ) : (
                          filteredResources.map((resource) => (
                            <tr key={resource.id} className="border-t">
                              <td className="p-3">{resource.id}</td>
                              <td className="p-3 font-medium">
                                {resource.name}
                              </td>
                              <td className="p-3 capitalize">
                                {resource.type.replace("-", " ")}
                              </td>
                              <td className="p-3">{resource.department}</td>
                              <td className="p-3">
                                <div>
                                  <div>{resource.floor}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {resource.wing}
                                  </div>
                                </div>
                              </td>
                              <td className="p-3">
                                <Badge
                                  variant="outline"
                                  className={getStatusColor(resource.status)}
                                >
                                  {resource.status.charAt(0).toUpperCase() +
                                    resource.status.slice(1)}
                                </Badge>
                              </td>
                              <td className="p-3">
                                {resource.patient || (
                                  <span className="text-muted-foreground">
                                    -
                                  </span>
                                )}
                              </td>
                              <td className="p-3">
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">
                                    View
                                  </Button>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>
                                        Actions
                                      </DropdownMenuLabel>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem>
                                        Assign
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        Schedule Maintenance
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        Release
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="border-t bg-muted/10 py-3">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredResources.length} of{" "}
                  {resourceAllocations.length} resources
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
