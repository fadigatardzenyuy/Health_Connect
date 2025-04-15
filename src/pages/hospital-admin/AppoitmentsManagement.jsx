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
import { Calendar, ClipboardList, Filter, Search, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AppointmentsManagement() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [department, setDepartment] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [appointmentNotes, setAppointmentNotes] = useState("");
  const [showBookingDialog, setShowBookingDialog] = useState(false);

  // Mock departments data
  const departments = [
    { id: "cardiology", name: "Cardiology" },
    { id: "orthopedics", name: "Orthopedics" },
    { id: "pediatrics", name: "Pediatrics" },
    { id: "neurology", name: "Neurology" },
    { id: "dermatology", name: "Dermatology" },
    { id: "ophthalmology", name: "Ophthalmology" },
    { id: "radiology", name: "Radiology" },
    { id: "general", name: "General Medicine" },
  ];

  // Mock appointments data
  const appointments = [
    {
      id: "apt-1",
      patientName: "Clara Johnson",
      patientId: "PT-24578",
      department: "Cardiology",
      date: "2025-04-10",
      time: "09:30 AM",
      appointmentType: "Consultation",
      status: "confirmed",
    },
    {
      id: "apt-2",
      patientName: "Samuel Ndong",
      patientId: "PT-24579",
      department: "Orthopedics",
      date: "2025-04-10",
      time: "11:00 AM",
      appointmentType: "Follow-up",
      status: "confirmed",
    },
    {
      id: "apt-3",
      patientName: "Elizabeth Fombu",
      patientId: "PT-24580",
      department: "General Medicine",
      date: "2025-04-11",
      time: "10:15 AM",
      appointmentType: "Check-up",
      status: "pending",
    },
    {
      id: "apt-4",
      patientName: "Peter Akum",
      patientId: "PT-24581",
      department: "Pediatrics",
      date: "2025-04-09",
      time: "02:30 PM",
      appointmentType: "Vaccination",
      status: "completed",
    },
    {
      id: "apt-5",
      patientName: "Mary Achu",
      patientId: "PT-24582",
      department: "Dermatology",
      date: "2025-04-12",
      time: "03:45 PM",
      appointmentType: "Consultation",
      status: "cancelled",
    },
  ];

  // Filter appointments based on tab and search
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      searchQuery === "" ||
      appointment.patientName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      appointment.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      (activeTab === "upcoming" &&
        ["confirmed", "pending"].includes(appointment.status)) ||
      (activeTab === "completed" && appointment.status === "completed") ||
      (activeTab === "cancelled" && appointment.status === "cancelled") ||
      activeTab === "all";

    return matchesSearch && matchesTab;
  });

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleExport = () => {
    toast({
      title: "Export initiated",
      description: "Appointments data is being prepared for export.",
    });
  };

  const handleBookAppointment = () => {
    // Validate input
    if (
      !patientName ||
      !patientId ||
      !department ||
      !appointmentType ||
      !appointmentDate ||
      !appointmentTime
    ) {
      toast({
        title: "Missing information",
        description:
          "Please fill in all required fields to book an appointment.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Appointment booked",
      description: `Appointment for ${patientName} has been scheduled for ${appointmentDate} at ${appointmentTime}.`,
    });

    // Reset form and close dialog
    setPatientName("");
    setPatientId("");
    setDepartment("");
    setAppointmentType("");
    setAppointmentDate("");
    setAppointmentTime("");
    setAppointmentNotes("");
    setShowBookingDialog(false);
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
              Appointments Management
            </h1>
            <p className="text-muted-foreground">
              View and manage all hospital appointments
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search appointments..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit">Search</Button>
            </form>

            <Button variant="outline" onClick={handleExport}>
              <ClipboardList className="mr-2 h-4 w-4" />
              Export
            </Button>

            <Dialog
              open={showBookingDialog}
              onOpenChange={setShowBookingDialog}
            >
              <DialogTrigger asChild>
                <Button className="gap-1">
                  <Plus className="h-4 w-4" />
                  Book Appointment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Book New Appointment</DialogTitle>
                  <DialogDescription>
                    Create a new hospital appointment. Fill in all the required
                    information.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patientName">Patient Name</Label>
                      <Input
                        id="patientName"
                        placeholder="Full Name"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patientId">Patient ID</Label>
                      <Input
                        id="patientId"
                        placeholder="PT-XXXXX"
                        value={patientId}
                        onChange={(e) => setPatientId(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select value={department} onValueChange={setDepartment}>
                        <SelectTrigger id="department">
                          <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="appointmentType">Appointment Type</Label>
                      <Select
                        value={appointmentType}
                        onValueChange={setAppointmentType}
                      >
                        <SelectTrigger id="appointmentType">
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="consultation">
                            Consultation
                          </SelectItem>
                          <SelectItem value="follow-up">Follow-up</SelectItem>
                          <SelectItem value="check-up">
                            General Check-up
                          </SelectItem>
                          <SelectItem value="procedure">Procedure</SelectItem>
                          <SelectItem value="vaccination">
                            Vaccination
                          </SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="appointmentDate">Appointment Date</Label>
                      <Input
                        id="appointmentDate"
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="appointmentTime">Appointment Time</Label>
                      <Input
                        id="appointmentTime"
                        type="time"
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="appointmentNotes">Notes</Label>
                    <Textarea
                      id="appointmentNotes"
                      placeholder="Any specific information or instructions..."
                      value={appointmentNotes}
                      onChange={(e) => setAppointmentNotes(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowBookingDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleBookAppointment}>
                    Book Appointment
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Hospital Appointments</CardTitle>
                <CardDescription>
                  Total: {appointments.length} appointments
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Calendar View
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>

          <Tabs
            defaultValue="upcoming"
            value={activeTab}
            onValueChange={setActiveTab}
            className="px-4"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <CardContent className="p-0 pb-4">
                <div className="rounded-md border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-3 font-medium">Patient</th>
                          <th className="text-left p-3 font-medium">
                            Department
                          </th>
                          <th className="text-left p-3 font-medium">Type</th>
                          <th className="text-left p-3 font-medium">
                            Date & Time
                          </th>
                          <th className="text-left p-3 font-medium">Status</th>
                          <th className="text-left p-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAppointments.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
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
                              <td className="p-3">{appointment.department}</td>
                              <td className="p-3">
                                {appointment.appointmentType}
                              </td>
                              <td className="p-3">
                                <div>
                                  <div>
                                    {new Date(
                                      appointment.date
                                    ).toLocaleDateString()}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {appointment.time}
                                  </div>
                                </div>
                              </td>
                              <td className="p-3">
                                <Badge
                                  variant="outline"
                                  className={getStatusColor(appointment.status)}
                                >
                                  {appointment.status.charAt(0).toUpperCase() +
                                    appointment.status.slice(1)}
                                </Badge>
                              </td>
                              <td className="p-3">
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">
                                    View
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    Edit
                                  </Button>
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
          </Tabs>
        </Card>
      </div>
    </AdminLayout>
  );
}
