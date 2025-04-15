import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Star,
  User,
  FileText,
  ScrollText,
  Stethoscope,
  Clock8,
  CreditCard,
  ChevronLeft,
  Info,
  UserPlus,
  Bookmark,
} from "lucide-react";
import { DoctorCard } from "@/components/hospital/DoctorCard";
import { DepartmentList } from "@/components/hospital/DepartmentList";
import { HospitalInfo } from "@/components/hospital/HospitalInfo";

// Mock hospital details
const mockHospital = {
  id: "h1",
  name: "General Hospital",
  address: "123 Main St, Cityville, CA 12345",
  phone: "(555) 123-4567",
  website: "https://www.generalhospital.org",
  description:
    "General Hospital is a full-service, 400-bed hospital offering comprehensive medical care across multiple specialties. Our state-of-the-art facilities and compassionate staff ensure patients receive the highest quality care.",
  rating: 4.5,
  reviewCount: 324,
  waitTime: "15-30 min",
  verified: true,
  services: [
    "Emergency Care",
    "Surgery",
    "Cardiology",
    "Neurology",
    "Oncology",
    "Pediatrics",
    "Obstetrics",
    "Radiology",
    "Laboratory",
  ],
  insuranceAccepted: [
    "Medicare",
    "Medicaid",
    "Blue Cross",
    "Aetna",
    "UnitedHealthcare",
    "Cigna",
  ],
  hours: {
    emergency: "24/7",
    general: "Mon-Fri: 8AM-8PM, Sat-Sun: 9AM-5PM",
    departments: {
      cardiology: "Mon-Fri: 9AM-5PM",
      neurology: "Mon-Fri: 9AM-5PM",
      pediatrics: "Mon-Fri: 8AM-7PM, Sat: 9AM-1PM",
    },
  },
  parkingInfo:
    "Free parking available in the North and South garages. Valet parking available at the main entrance for $8 per day.",
  departments: [
    {
      id: "dept1",
      name: "Cardiology",
      description: "Specialized care for heart and cardiovascular conditions",
      floorNumber: "3rd Floor, East Wing",
      waitTime: "30 min",
      doctorCount: 12,
    },
    {
      id: "dept2",
      name: "Neurology",
      description: "Diagnosis and treatment of neurological disorders",
      floorNumber: "4th Floor, West Wing",
      waitTime: "45 min",
      doctorCount: 8,
    },
    {
      id: "dept3",
      name: "Pediatrics",
      description: "Medical care for infants, children, and adolescents",
      floorNumber: "2nd Floor, North Wing",
      waitTime: "20 min",
      doctorCount: 15,
    },
  ],
  doctors: [
    {
      id: "doc1",
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      rating: 4.8,
      reviewCount: 156,
      education: "Harvard Medical School",
      experience: "15 years",
      acceptingNewPatients: true,
      nextAvailable: "Tomorrow, 2:30 PM",
      imageUrl: "/placeholder.svg",
    },
    {
      id: "doc2",
      name: "Dr. James Smith",
      specialty: "Neurology",
      rating: 4.6,
      reviewCount: 98,
      education: "Johns Hopkins University",
      experience: "12 years",
      acceptingNewPatients: true,
      nextAvailable: "Friday, 10:15 AM",
      imageUrl: "/placeholder.svg",
    },
    {
      id: "doc3",
      name: "Dr. Emily Wong",
      specialty: "Pediatrics",
      rating: 4.9,
      reviewCount: 210,
      education: "Stanford University",
      experience: "8 years",
      acceptingNewPatients: false,
      nextAvailable: "Next Week",
      imageUrl: "/placeholder.svg",
    },
  ],
};

const HospitalDetail = () => {
  const { hospitalId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hospital, setHospital] = useState(mockHospital);
  const [activeTab, setActiveTab] = useState("info");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHospitalDetails = async () => {
      try {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setHospital(mockHospital);
      } catch (error) {
        console.error("Error loading hospital details:", error);
        toast({
          title: "Error",
          description: "Could not load hospital information",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadHospitalDetails();
  }, [hospitalId, toast]);

  const handleBookAppointment = () => {
    navigate(`/consultation-booking?hospitalId=${hospitalId}`);
  };

  const handleDepartmentSelect = (departmentId) => {
    console.log(`Selected department: ${departmentId}`);
    setActiveTab("doctors");
  };

  const handleDoctorSelect = (doctorId) => {
    navigate(
      `/consultation-booking?hospitalId=${hospitalId}&doctorId=${doctorId}`
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="col-span-12 space-y-4">
          <div className="animate-pulse h-8 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="animate-pulse h-64 bg-gray-200 rounded mb-4"></div>
          <div className="animate-pulse h-48 bg-gray-200 rounded"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="col-span-12 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{hospital.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{hospital.address}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 py-1">
            <Clock8 className="h-3 w-3 mr-1" />
            Current Wait: {hospital.waitTime}
          </Badge>

          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 py-1">
            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
            {hospital.rating} ({hospital.reviewCount} reviews)
          </Badge>

          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 py-1">
            <CreditCard className="h-3 w-3 mr-1" />
            {hospital.insuranceAccepted.length} Insurance Plans Accepted
          </Badge>

          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 py-1">
            <Stethoscope className="h-3 w-3 mr-1" />
            {hospital.departments.length} Departments
          </Badge>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3 space-y-6">
            <Card className="border">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 lg:grid-cols-5 w-full">
                  <TabsTrigger value="info">
                    <Info className="h-4 w-4 mr-2 hidden md:inline" />
                    About
                  </TabsTrigger>
                  <TabsTrigger value="departments">
                    <Building className="h-4 w-4 mr-2 hidden md:inline" />
                    Departments
                  </TabsTrigger>
                  <TabsTrigger value="doctors">
                    <User className="h-4 w-4 mr-2 hidden md:inline" />
                    Doctors
                  </TabsTrigger>
                  <TabsTrigger value="services">
                    <FileText className="h-4 w-4 mr-2 hidden md:inline" />
                    Services
                  </TabsTrigger>
                  <TabsTrigger value="insurance">
                    <ScrollText className="h-4 w-4 mr-2 hidden md:inline" />
                    Insurance
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="info">
                  <HospitalInfo hospital={hospital} />
                </TabsContent>

                <TabsContent value="departments">
                  <CardContent className="p-6">
                    <DepartmentList
                      departments={hospital.departments}
                      onSelectDepartment={handleDepartmentSelect}
                    />
                  </CardContent>
                </TabsContent>

                <TabsContent value="doctors">
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">
                          Available Doctors
                        </h3>
                        <Button variant="outline" size="sm">
                          <UserPlus className="h-4 w-4 mr-1" />
                          Find Doctor
                        </Button>
                      </div>

                      {hospital.doctors.map((doctor) => (
                        <DoctorCard
                          key={doctor.id}
                          doctor={doctor}
                          onSelect={() => handleDoctorSelect(doctor.id)}
                        />
                      ))}
                    </div>
                  </CardContent>
                </TabsContent>

                <TabsContent value="services">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Available Services
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {hospital.services.map((service, index) => (
                          <div
                            key={index}
                            className="p-3 border rounded-md bg-muted/5 flex items-center"
                          >
                            <Stethoscope className="h-4 w-4 mr-2 text-primary" />
                            <span>{service}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </TabsContent>

                <TabsContent value="insurance">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Accepted Insurance Plans
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {hospital.insuranceAccepted.map((insurance, index) => (
                          <div
                            key={index}
                            className="p-3 border rounded-md bg-muted/5 flex items-center"
                          >
                            <CreditCard className="h-4 w-4 mr-2 text-primary" />
                            <span>{insurance}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          <div className="md:w-1/3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Book an Appointment</CardTitle>
                <CardDescription>
                  Schedule a visit with a doctor at {hospital.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      Current wait time: {hospital.waitTime}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      Next available: Today at 3:30 PM
                    </span>
                  </div>

                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{hospital.phone}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button className="w-full" onClick={handleBookAppointment}>
                  Book Appointment
                </Button>
                <Button variant="outline" className="w-full">
                  <Bookmark className="h-4 w-4 mr-1" />
                  Save to Favorites
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Hospital Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <h4 className="text-sm font-medium">Emergency Care</h4>
                    <p className="text-sm text-muted-foreground">
                      {hospital.hours.emergency}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">General Hours</h4>
                    <p className="text-sm text-muted-foreground">
                      {hospital.hours.general}
                    </p>
                  </div>
                  <div className="pt-2 border-t">
                    <h4 className="text-sm font-medium pt-2">
                      Department Hours
                    </h4>
                    {Object.entries(hospital.hours.departments).map(
                      ([dept, hours]) => (
                        <div key={dept} className="mt-2">
                          <p className="text-sm font-medium capitalize">
                            {dept}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {hours}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HospitalDetail;
