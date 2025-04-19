import { useEffect, useState, useRef } from "react";
import { AdminLayout } from "@/components/hospital-admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import {
  Loader2,
  Upload,
  X,
  Camera,
  Building2,
  Mail,
  CalendarClock,
  Award,
  FileEdit,
  Save,
  ShieldCheck,
  MapPin,
  Phone,
  Clock,
  Star,
  Stethoscope,
  Users,
  Calendar,
  Activity,
  Bed,
  Info,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

const HospitalProfile = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const fileInputRef = useRef(null);

  const [hospital, setHospital] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    logoUrl: "",
    address: "",
    phone: "",
    website: "",
    description: "",
    type: "",
    specialties: [],
    openingHours: "",
    emergencyServices: false,
    bedCount: 0,
    founded: "",
    rating: 0,
  });

  // Mock data for hospital - in a real app, you'd fetch this from your database
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockHospital = {
        id: "hosp-123",
        name: "Memorial Regional Hospital",
        email: "contact@memorialregional.com",
        logoUrl: "", // Empty for fallback demo
        address: "5800 Medical Drive, Orlando, FL 32801",
        phone: "(407) 555-1234",
        website: "www.memorialregional.com",
        description:
          "Memorial Regional Hospital is a leading healthcare provider offering comprehensive medical services with a focus on patient-centered care. Our state-of-the-art facilities and dedicated team of healthcare professionals are committed to delivering exceptional health services to our community.",
        type: "General Hospital",
        specialties: [
          "Cardiology",
          "Neurology",
          "Orthopedics",
          "Oncology",
          "Pediatrics",
        ],
        openingHours: "24/7",
        emergencyServices: true,
        bedCount: 350,
        founded: "1987",
        rating: 4.7,
        isVerified: true,
        stats: {
          doctors: 120,
          annualPatients: 45000,
          successRate: 98.5,
          departments: 15,
        },
      };

      setHospital(mockHospital);
      setFormData({
        name: mockHospital.name,
        email: mockHospital.email,
        logoUrl: mockHospital.logoUrl,
        address: mockHospital.address,
        phone: mockHospital.phone,
        website: mockHospital.website,
        description: mockHospital.description,
        type: mockHospital.type,
        specialties: mockHospital.specialties,
        openingHours: mockHospital.openingHours,
        emergencyServices: mockHospital.emergencyServices,
        bedCount: mockHospital.bedCount,
        founded: mockHospital.founded,
        rating: mockHospital.rating,
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSpecialtiesChange = (e) => {
    const value = e.target.value;
    const specialtiesArray = value.split(",").map((item) => item.trim());
    setFormData((prev) => ({ ...prev, specialties: specialtiesArray }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setHospital({
        ...hospital,
        ...formData,
      });
      setIsEditing(false);
      setIsLoading(false);

      toast({
        title: "Hospital Profile Updated",
        description: "The hospital information has been successfully updated.",
      });
    }, 1000);
  };

  const handleLogoClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `hospital-${hospital.id}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    setIsUploading(true);

    try {
      // Simulate file upload process
      setTimeout(() => {
        // Mock successful upload with a placeholder URL
        const mockUrl = "/api/placeholder/400/320";
        setFormData((prev) => ({ ...prev, logoUrl: mockUrl }));

        toast({
          title: "Logo Uploaded",
          description: "Hospital logo has been uploaded successfully.",
        });
        setIsUploading(false);
      }, 1500);
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload logo. Please try again.",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  const removeLogo = () => {
    setFormData((prev) => ({ ...prev, logoUrl: "" }));
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh] col-span-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (!hospital) {
    return (
      <AdminLayout>
        <div className="col-span-12">
          <Card className="border-none shadow-md">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center p-8 gap-4">
                <Building2 className="h-16 w-16 text-gray-300" />
                <p className="text-center text-lg font-medium">
                  Hospital information not available.
                </p>
                <Button className="mt-2">Go Back</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="col-span-12 md:col-span-10 md:col-start-2 lg:col-span-8 lg:col-start-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Hospital Header Card */}
          <Card className="md:col-span-12 border-none shadow-md bg-gradient-to-r from-teal-50 to-blue-50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <Avatar
                    className={`h-24 w-24 md:h-32 md:w-32 ring-4 ring-white shadow-lg cursor-${
                      isEditing ? "pointer" : "default"
                    } ${isEditing ? "hover:opacity-80" : ""}`}
                    onClick={handleLogoClick}
                  >
                    {isUploading ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                      </div>
                    ) : (
                      <>
                        <AvatarImage
                          src={formData.logoUrl}
                          alt={formData.name}
                        />
                        <AvatarFallback className="text-3xl bg-gradient-to-br from-teal-500 to-blue-600 text-white">
                          {formData.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase() || "H"}
                        </AvatarFallback>

                        {isEditing && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 rounded-full transition-opacity">
                            <Camera className="h-8 w-8 text-white" />
                          </div>
                        )}
                      </>
                    )}
                  </Avatar>

                  {isEditing && formData.logoUrl && (
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <div className="text-center md:text-left flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                        {hospital.name}
                      </h2>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 mt-1 text-gray-500">
                        <p className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" /> {hospital.address}
                        </p>
                        <span className="hidden md:inline">•</span>
                        <p className="flex items-center gap-1">
                          <Phone className="h-4 w-4" /> {hospital.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-center md:justify-end">
                      {hospital.emergencyServices && (
                        <Badge className="px-3 py-1 bg-red-500 hover:bg-red-600">
                          <div className="flex items-center gap-1">
                            <Activity className="h-4 w-4" />
                            Emergency Services
                          </div>
                        </Badge>
                      )}
                      {hospital.isVerified && (
                        <Badge
                          variant="default"
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600"
                        >
                          <div className="flex items-center gap-1">
                            <ShieldCheck className="h-4 w-4" />
                            Verified
                          </div>
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-1 justify-center md:justify-start">
                    <Building2 className="h-4 w-4 text-teal-600" />
                    <span className="text-gray-700">{hospital.type}</span>
                    <span className="mx-2">•</span>
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-gray-700">{hospital.rating}/5</span>
                    <span className="mx-2">•</span>
                    <Clock className="h-4 w-4 text-teal-600" />
                    <span className="text-gray-700">
                      {hospital.openingHours}
                    </span>
                  </div>

                  {!isEditing && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                      className="mt-4"
                    >
                      <FileEdit className="h-4 w-4 mr-2" /> Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Cards */}
          {!isEditing && (
            <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-none shadow-sm bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Doctors
                      </p>
                      <h3 className="text-2xl font-bold text-gray-800 mt-1">
                        {hospital.stats.doctors}
                      </h3>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Stethoscope className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-teal-50">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Annual Patients
                      </p>
                      <h3 className="text-2xl font-bold text-gray-800 mt-1">
                        {hospital.stats.annualPatients.toLocaleString()}
                      </h3>
                    </div>
                    <div className="p-3 bg-teal-100 rounded-full">
                      <Users className="h-6 w-6 text-teal-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-green-50">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Success Rate
                      </p>
                      <h3 className="text-2xl font-bold text-gray-800 mt-1">
                        {hospital.stats.successRate}%
                      </h3>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <Activity className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-purple-50">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Departments
                      </p>
                      <h3 className="text-2xl font-bold text-gray-800 mt-1">
                        {hospital.stats.departments}
                      </h3>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Bed className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Hospital Content */}
          <div className="md:col-span-12">
            {isEditing ? (
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileEdit className="h-5 w-5" /> Edit Hospital Profile
                  </CardTitle>
                  <CardDescription>
                    Update hospital information and profile settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-sm font-medium flex items-center gap-2"
                        >
                          <Building2 className="h-4 w-4 text-gray-500" />{" "}
                          Hospital Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-sm font-medium flex items-center gap-2"
                        >
                          <Mail className="h-4 w-4 text-gray-500" /> Email
                          Address
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="text-sm font-medium flex items-center gap-2"
                        >
                          <Phone className="h-4 w-4 text-gray-500" /> Phone
                          Number
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="website"
                          className="text-sm font-medium flex items-center gap-2"
                        >
                          <Info className="h-4 w-4 text-gray-500" /> Website
                        </Label>
                        <Input
                          id="website"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="address"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4 text-gray-500" /> Address
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="description"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <Info className="h-4 w-4 text-gray-500" /> Description
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="type"
                          className="text-sm font-medium flex items-center gap-2"
                        >
                          <Building2 className="h-4 w-4 text-gray-500" />{" "}
                          Hospital Type
                        </Label>
                        <Input
                          id="type"
                          name="type"
                          value={formData.type}
                          onChange={handleChange}
                          className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="bedCount"
                          className="text-sm font-medium flex items-center gap-2"
                        >
                          <Bed className="h-4 w-4 text-gray-500" /> Bed Count
                        </Label>
                        <Input
                          id="bedCount"
                          name="bedCount"
                          type="number"
                          value={formData.bedCount}
                          onChange={handleChange}
                          className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="founded"
                          className="text-sm font-medium flex items-center gap-2"
                        >
                          <CalendarClock className="h-4 w-4 text-gray-500" />{" "}
                          Founded Year
                        </Label>
                        <Input
                          id="founded"
                          name="founded"
                          value={formData.founded}
                          onChange={handleChange}
                          className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="openingHours"
                          className="text-sm font-medium flex items-center gap-2"
                        >
                          <Clock className="h-4 w-4 text-gray-500" /> Opening
                          Hours
                        </Label>
                        <Input
                          id="openingHours"
                          name="openingHours"
                          value={formData.openingHours}
                          onChange={handleChange}
                          className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="specialties"
                          className="text-sm font-medium flex items-center gap-2"
                        >
                          <Stethoscope className="h-4 w-4 text-gray-500" />{" "}
                          Specialties (comma separated)
                        </Label>
                        <Input
                          id="specialties"
                          name="specialties"
                          value={formData.specialties.join(", ")}
                          onChange={handleSpecialtiesChange}
                          className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="emergencyServices"
                        name="emergencyServices"
                        checked={formData.emergencyServices}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <Label
                        htmlFor="emergencyServices"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <Activity className="h-4 w-4 text-red-500" /> Provides
                        Emergency Services
                      </Label>
                    </div>

                    <Separator />

                    <div className="flex justify-end space-x-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          if (hospital) {
                            setFormData({
                              name: hospital.name,
                              email: hospital.email,
                              logoUrl: hospital.logoUrl,
                              address: hospital.address,
                              phone: hospital.phone,
                              website: hospital.website,
                              description: hospital.description,
                              type: hospital.type,
                              specialties: hospital.specialties,
                              openingHours: hospital.openingHours,
                              emergencyServices: hospital.emergencyServices,
                              bedCount: hospital.bedCount,
                              founded: hospital.founded,
                              rating: hospital.rating,
                            });
                          }
                        }}
                        className="border-gray-300"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        <Save className="h-4 w-4 mr-2" /> Save Changes
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-none shadow-md">
                <Tabs
                  defaultValue="info"
                  className="w-full"
                  onValueChange={setActiveTab}
                >
                  <CardHeader className="pb-2">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="info" className="text-sm">
                        Hospital Information
                      </TabsTrigger>
                      <TabsTrigger value="departments" className="text-sm">
                        Departments & Specialties
                      </TabsTrigger>
                      <TabsTrigger value="services" className="text-sm">
                        Services & Facilities
                      </TabsTrigger>
                    </TabsList>
                  </CardHeader>
                  <CardContent>
                    <TabsContent value="info" className="mt-4 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-3">
                              About Hospital
                            </h3>
                            <p className="text-gray-600">
                              {hospital.description}
                            </p>
                          </div>

                          <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-3">
                              Contact Information
                            </h3>
                            <div className="space-y-3">
                              <div className="flex items-start space-x-3">
                                <MapPin className="h-5 w-5 text-teal-600 mt-0.5" />
                                <div>
                                  <p className="font-medium">Address</p>
                                  <p className="text-gray-600">
                                    {hospital.address}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start space-x-3">
                                <Phone className="h-5 w-5 text-teal-600 mt-0.5" />
                                <div>
                                  <p className="font-medium">Phone</p>
                                  <p className="text-gray-600">
                                    {hospital.phone}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start space-x-3">
                                <Mail className="h-5 w-5 text-teal-600 mt-0.5" />
                                <div>
                                  <p className="font-medium">Email</p>
                                  <p className="text-gray-600">
                                    {hospital.email}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start space-x-3">
                                <Info className="h-5 w-5 text-teal-600 mt-0.5" />
                                <div>
                                  <p className="font-medium">Website</p>
                                  <p className="text-gray-600">
                                    {hospital.website}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-3">
                              Hospital Details
                            </h3>
                            <div className="space-y-3">
                              <div className="flex items-start space-x-3">
                                <Building2 className="h-5 w-5 text-teal-600 mt-0.5" />
                                <div>
                                  <p className="font-medium">Type</p>
                                  <p className="text-gray-600">
                                    {hospital.type}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start space-x-3">
                                <Clock className="h-5 w-5 text-teal-600 mt-0.5" />
                                <div>
                                  <p className="font-medium">Operating Hours</p>
                                  <p className="text-gray-600">
                                    {hospital.openingHours}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start space-x-3">
                                <CalendarClock className="h-5 w-5 text-teal-600 mt-0.5" />
                                <div>
                                  <p className="font-medium">Established</p>
                                  <p className="text-gray-600">
                                    {hospital.founded}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start space-x-3">
                                <Bed className="h-5 w-5 text-teal-600 mt-0.5" />
                                <div>
                                  <p className="font-medium">Bed Capacity</p>
                                  <p className="text-gray-600">
                                    {hospital.bedCount}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start space-x-3">
                                <Activity className="h-5 w-5 text-teal-600 mt-0.5" />
                                <div>
                                  <p className="font-medium">
                                    Emergency Services
                                  </p>
                                  <p className="text-gray-600">
                                    {hospital.emergencyServices ? (
                                      <Badge
                                        variant="default"
                                        className="bg-red-500"
                                      >
                                        Available 24/7
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline">
                                        Not Available
                                      </Badge>
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-3">
                              Ratings & Reviews
                            </h3>
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold">
                                  {hospital.rating}
                                </span>
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-5 w-5 ${
                                        i < Math.floor(hospital.rating)
                                          ? "text-yellow-500 fill-yellow-500"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">
                                  based on patient reviews
                                </span>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm w-24">
                                    Care Quality
                                  </span>
                                  <Progress value={92} className="h-2" />
                                  <span className="text-sm">92%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm w-24">
                                    Cleanliness
                                  </span>
                                  <Progress value={95} className="h-2" />
                                  <span className="text-sm">95%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm w-24">Staff</span>
                                  <Progress value={90} className="h-2" />
                                  <span className="text-sm">90%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm w-24">
                                    Wait Times
                                  </span>
                                  <Progress value={85} className="h-2" />
                                  <span className="text-sm">85%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="departments" className="mt-4">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium text-gray-800 mb-4">
                            Departments & Specialties
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border shadow-sm">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                  <Stethoscope className="h-5 w-5 text-teal-600" />{" "}
                                  Medical Specialties
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="flex flex-wrap gap-2">
                                  {hospital.specialties.map(
                                    (specialty, index) => (
                                      <Badge
                                        key={index}
                                        variant="secondary"
                                        className="py-1 px-3"
                                      >
                                        {specialty}
                                      </Badge>
                                    )
                                  )}
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="border shadow-sm">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                  <Users className="h-5 w-5 text-teal-600" />{" "}
                                  Key Departments
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-2">
                                  <li className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                                    <span>Emergency Medicine</span>
                                  </li>
                                  <li className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                                    <span>Intensive Care Unit</span>
                                  </li>
                                  <li className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                                    <span>Surgery Department</span>
                                  </li>
                                  <li className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                                    <span>Pediatrics</span>
                                  </li>
                                  <li className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                                    <span>Obstetrics & Gynecology</span>
                                  </li>
                                </ul>
                              </CardContent>
                            </Card>
                          </div>

                          <div className="mt-6">
                            <Card className="border shadow-sm">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                  <Award className="h-5 w-5 text-teal-600" />{" "}
                                  Center of Excellence
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="bg-blue-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-blue-800">
                                      Cardiac Care
                                    </h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                      State-of-the-art cardiac care with
                                      specialized surgeons and advanced
                                      equipment
                                    </p>
                                  </div>

                                  <div className="bg-teal-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-teal-800">
                                      Cancer Treatment
                                    </h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                      Comprehensive cancer care including
                                      radiation therapy and immunotherapy
                                    </p>
                                  </div>

                                  <div className="bg-purple-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-purple-800">
                                      Neurology
                                    </h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                      Advanced neurological treatments and brain
                                      surgery specialists
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="services" className="mt-4">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium text-gray-800 mb-4">
                            Services & Facilities
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border shadow-sm">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                  <Activity className="h-5 w-5 text-teal-600" />{" "}
                                  Medical Services
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                                    <span className="text-sm">
                                      24/7 Emergency Care
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                                    <span className="text-sm">
                                      Laboratory Services
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                                    <span className="text-sm">
                                      Radiology & Imaging
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                                    <span className="text-sm">Surgery</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                                    <span className="text-sm">
                                      Physical Therapy
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                                    <span className="text-sm">
                                      Mental Health Services
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                                    <span className="text-sm">
                                      Maternity Care
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                                    <span className="text-sm">Dialysis</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="border shadow-sm">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                  <Building2 className="h-5 w-5 text-teal-600" />{" "}
                                  Facilities
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                    <span className="text-sm">Cafeteria</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                    <span className="text-sm">Pharmacy</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                    <span className="text-sm">Gift Shop</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                    <span className="text-sm">
                                      Chapel/Prayer Room
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                    <span className="text-sm">ATM</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                    <span className="text-sm">Parking</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                    <span className="text-sm">Wi-Fi</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                    <span className="text-sm">
                                      Family Waiting Areas
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          <div className="mt-6">
                            <Card className="border shadow-sm">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                  <Calendar className="h-5 w-5 text-teal-600" />{" "}
                                  Schedule an Appointment
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="bg-blue-50 p-4 rounded-lg">
                                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                                    <div>
                                      <h4 className="font-medium">
                                        Need to book an appointment?
                                      </h4>
                                      <p className="text-sm text-gray-600 mt-1">
                                        Book an appointment with one of our
                                        specialists or for a medical service
                                      </p>
                                    </div>
                                    <Button className="bg-teal-600 hover:bg-teal-700 whitespace-nowrap">
                                      Book Appointment
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </CardContent>

                  <CardFooter className="pt-0 flex justify-end">
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      <FileEdit className="h-4 w-4 mr-2" /> Edit Hospital
                      Profile
                    </Button>
                  </CardFooter>
                </Tabs>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default HospitalProfile;
