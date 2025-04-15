import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  Hospital,
  MapPin,
  Search,
  Star,
  User,
  Calendar as CalendarIcon,
} from "lucide-react";

// Sample hospital data for the UI
const nearbyHospitals = [
  {
    id: "h1",
    name: "General Medical Center",
    address: "123 Medical Drive, Healthville",
    distance: "2.5 miles",
    rating: 4.7,
    specialties: ["Cardiology", "Neurology", "Orthopedics"],
    image:
      "https://ui-avatars.com/api/?name=General+Medical&background=0D8ABC&color=fff",
  },
  {
    id: "h2",
    name: "Community Hospital",
    address: "456 Health Avenue, Wellnesstown",
    distance: "3.8 miles",
    rating: 4.5,
    specialties: ["Pediatrics", "General Surgery", "Obstetrics"],
    image:
      "https://ui-avatars.com/api/?name=Community+Hospital&background=2A9D8F&color=fff",
  },
  {
    id: "h3",
    name: "Specialized Care Center",
    address: "789 Specialized Blvd, Treatmentville",
    distance: "5.2 miles",
    rating: 4.9,
    specialties: ["Oncology", "Dermatology", "Urology"],
    image:
      "https://ui-avatars.com/api/?name=Specialized+Care&background=E9C46A&color=fff",
  },
];

const upcomingAppointments = [
  {
    id: "apt1",
    hospitalName: "General Medical Center",
    doctorName: "Dr. Sarah Johnson",
    doctorSpecialty: "Cardiologist",
    doctorAvatar: "https://ui-avatars.com/api/?name=Sarah+Johnson",
    date: "2023-08-15",
    time: "10:30 AM",
    status: "confirmed",
  },
  {
    id: "apt2",
    hospitalName: "Community Hospital",
    doctorName: "Dr. Michael Chen",
    doctorSpecialty: "Pediatrician",
    doctorAvatar: "https://ui-avatars.com/api/?name=Michael+Chen",
    date: "2023-08-22",
    time: "2:15 PM",
    status: "scheduled",
  },
];

export function PatientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("hospitals");

  // Filter hospitals based on search term
  const filteredHospitals = nearbyHospitals.filter(
    (hospital) =>
      hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.specialties.some((specialty) =>
        specialty.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // Handle hospital selection for booking
  const handleBookAppointment = (hospitalId) => {
    navigate(`/hospital/${hospitalId}`);
  };

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-none">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">
                Welcome, {user?.name || "Patient"}
              </CardTitle>
              <CardDescription>
                What can we help you with today?
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              className="flex-1"
              onClick={() => setActiveTab("hospitals")}
            >
              <Hospital className="mr-2 h-4 w-4" />
              Find Hospitals
            </Button>
            <Button
              className="flex-1"
              variant="secondary"
              onClick={() => navigate("/medical-history")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              View Medical History
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main content tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="hospitals">Find Hospitals</TabsTrigger>
          <TabsTrigger value="appointments">My Appointments</TabsTrigger>
          <TabsTrigger value="history">Medical History</TabsTrigger>
        </TabsList>

        {/* Hospitals Tab */}
        <TabsContent value="hospitals" className="space-y-4 mt-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Search hospitals by name, location, or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Hospital List */}
          <div className="grid gap-4">
            {filteredHospitals.map((hospital) => (
              <Card
                key={hospital.id}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 p-4 flex justify-center items-center bg-muted">
                    <img
                      src={hospital.image}
                      alt={hospital.name}
                      className="h-24 w-24 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {hospital.name}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {hospital.address}
                        </div>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm font-medium">
                            {hospital.rating}
                          </span>
                          <span className="text-sm text-muted-foreground ml-2">
                            {hospital.distance} away
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {hospital.specialties.map((specialty) => (
                            <Badge
                              key={specialty}
                              variant="secondary"
                              className="text-xs"
                            >
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="md:text-right mt-2 md:mt-0">
                        <Button
                          onClick={() => handleBookAppointment(hospital.id)}
                          size="sm"
                        >
                          Book Appointment
                        </Button>
                        <div className="text-xs text-muted-foreground mt-1">
                          Next available: Today, 3:00 PM
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="space-y-4 mt-4">
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              <h3 className="font-medium">Upcoming Appointments</h3>
              {upcomingAppointments.map((appointment) => (
                <Card key={appointment.id} className="overflow-hidden">
                  <div className="flex border-l-4 border-primary">
                    <div className="p-4 text-center border-r">
                      <div className="font-semibold">
                        {new Date(appointment.date).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )}
                      </div>
                      <div className="text-sm">{appointment.time}</div>
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={appointment.doctorAvatar} />
                              <AvatarFallback>
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">
                                {appointment.doctorName}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {appointment.doctorSpecialty}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2">
                            <div className="text-sm">
                              <Hospital className="h-3 w-3 inline mr-1" />
                              {appointment.hospitalName}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center mt-2 sm:mt-0">
                          <Badge
                            variant={
                              appointment.status === "confirmed"
                                ? "default"
                                : "outline"
                            }
                          >
                            {appointment.status === "confirmed"
                              ? "Confirmed"
                              : "Scheduled"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex justify-between mt-4 border-t pt-3">
                        <Button variant="outline" size="sm">
                          <Calendar className="h-4 w-4 mr-1" /> Reschedule
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() =>
                            navigate(`/appointment-details/${appointment.id}`)
                          }
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="font-medium text-lg mb-1">
                  No Upcoming Appointments
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  You don't have any scheduled appointments at the moment.
                </p>
                <Button onClick={() => setActiveTab("hospitals")}>
                  Book an Appointment
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Medical History Tab */}
        <TabsContent value="history" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Medical History Overview</CardTitle>
              <CardDescription>
                View your medical records and history
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Button onClick={() => navigate("/medical-history")}>
                View Complete Medical History
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
