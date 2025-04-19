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
  UserPlus,
  Filter,
  Download,
  UserX,
  UserCheck,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

// Mock data for staff members
const mockStaffData = [
  {
    id: "staff-001",
    name: "Dr. James Collins",
    role: "Doctor",
    department: "Cardiology",
    specialty: "Interventional Cardiology",
    status: "active",
    dateJoined: "2022-03-15",
    contact: "+234-555-1234",
    email: "james.collins@example.com",
  },
  {
    id: "staff-002",
    name: "Dr. Sarah Johnson",
    role: "Doctor",
    department: "Pediatrics",
    specialty: "Neonatology",
    status: "active",
    dateJoined: "2023-01-10",
    contact: "+234-555-2345",
    email: "sarah.johnson@example.com",
  },
  {
    id: "staff-003",
    name: "Nurse Mary Williams",
    role: "Nurse",
    department: "Emergency",
    specialty: "Critical Care",
    status: "active",
    dateJoined: "2021-06-22",
    contact: "+234-555-3456",
    email: "mary.williams@example.com",
  },
  {
    id: "staff-004",
    name: "Dr. Michael Brown",
    role: "Doctor",
    department: "Orthopedics",
    specialty: "Spine Surgery",
    status: "on leave",
    dateJoined: "2020-09-05",
    contact: "+234-555-4567",
    email: "michael.brown@example.com",
  },
  {
    id: "staff-005",
    name: "Nurse John Davis",
    role: "Nurse",
    department: "Oncology",
    specialty: "Chemotherapy",
    status: "active",
    dateJoined: "2023-03-30",
    contact: "+234-555-5678",
    email: "john.davis@example.com",
  },
  {
    id: "staff-006",
    name: "Dr. Elizabeth Martinez",
    role: "Doctor",
    department: "Neurology",
    specialty: "Epilepsy",
    status: "inactive",
    dateJoined: "2019-11-15",
    contact: "+234-555-6789",
    email: "elizabeth.martinez@example.com",
  },
];

export default function StaffManagement() {
  const { toast } = useToast();
  const [staffData, setStaffData] = useState(mockStaffData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [isAddStaffDialogOpen, setIsAddStaffDialogOpen] = useState(false);

  // Filter staff based on search query and selected tab
  const filteredStaff = staffData.filter((staff) => {
    const matchesSearch =
      searchQuery === "" ||
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      selectedTab === "all" ||
      (selectedTab === "doctors" && staff.role === "Doctor") ||
      (selectedTab === "nurses" && staff.role === "Nurse") ||
      (selectedTab === "active" && staff.status === "active") ||
      (selectedTab === "inactive" && staff.status !== "active");

    return matchesSearch && matchesTab;
  });

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleDownloadReport = () => {
    toast({
      title: "Report download initiated",
      description: "Staff report is being generated for download.",
    });
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    setIsAddStaffDialogOpen(false);
    toast({
      title: "Staff member added",
      description: "New staff member has been successfully added.",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Inactive
          </Badge>
        );
      case "on leave":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            On Leave
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Staff Management
            </h1>
            <p className="text-muted-foreground">
              Manage hospital personnel and credentialing
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search staff..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit">Search</Button>
            </form>

            <Dialog
              open={isAddStaffDialogOpen}
              onOpenChange={setIsAddStaffDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Staff
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Staff Member</DialogTitle>
                  <DialogDescription>
                    Fill in the details to add a new staff member to the
                    hospital.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddStaff}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Full Name
                      </Label>
                      <Input id="name" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="role" className="text-right">
                        Role
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="doctor">Doctor</SelectItem>
                          <SelectItem value="nurse">Nurse</SelectItem>
                          <SelectItem value="administrative">
                            Administrative
                          </SelectItem>
                          <SelectItem value="lab">Lab Technician</SelectItem>
                          <SelectItem value="pharmacy">Pharmacist</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="department" className="text-right">
                        Department
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cardiology">Cardiology</SelectItem>
                          <SelectItem value="neurology">Neurology</SelectItem>
                          <SelectItem value="orthopedics">
                            Orthopedics
                          </SelectItem>
                          <SelectItem value="pediatrics">Pediatrics</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                          <SelectItem value="oncology">Oncology</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="contact" className="text-right">
                        Contact
                      </Label>
                      <Input id="contact" className="col-span-3" required />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Staff Member</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={handleDownloadReport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Hospital Staff</CardTitle>
                <CardDescription>
                  Total: {staffData.length} staff members
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>

          <Tabs
            defaultValue="all"
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="px-4"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Staff</TabsTrigger>
              <TabsTrigger value="doctors">Doctors</TabsTrigger>
              <TabsTrigger value="nurses">Nurses</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab}>
              <CardContent className="p-0 pb-4">
                <div className="rounded-md border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-3 font-medium">
                            Staff ID
                          </th>
                          <th className="text-left p-3 font-medium">Name</th>
                          <th className="text-left p-3 font-medium">Role</th>
                          <th className="text-left p-3 font-medium">
                            Department
                          </th>
                          <th className="text-left p-3 font-medium">Status</th>
                          <th className="text-left p-3 font-medium">Contact</th>
                          <th className="text-left p-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStaff.length === 0 ? (
                          <tr>
                            <td
                              colSpan={7}
                              className="p-4 text-center text-muted-foreground"
                            >
                              No staff members found
                            </td>
                          </tr>
                        ) : (
                          filteredStaff.map((staff) => (
                            <tr key={staff.id} className="border-t">
                              <td className="p-3">{staff.id}</td>
                              <td className="p-3">
                                <div>
                                  <div className="font-medium">
                                    {staff.name}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {staff.email}
                                  </div>
                                </div>
                              </td>
                              <td className="p-3">{staff.role}</td>
                              <td className="p-3">
                                <div>
                                  <div>{staff.department}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {staff.specialty}
                                  </div>
                                </div>
                              </td>
                              <td className="p-3">
                                {getStatusBadge(staff.status)}
                              </td>
                              <td className="p-3">{staff.contact}</td>
                              <td className="p-3">
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">
                                    View
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    Edit
                                  </Button>
                                  {staff.status === "active" ? (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-500"
                                    >
                                      <UserX className="h-4 w-4" />
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-green-500"
                                    >
                                      <UserCheck className="h-4 w-4" />
                                    </Button>
                                  )}
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
