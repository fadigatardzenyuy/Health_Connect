import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  Check,
  ChevronRight,
  Hospital,
  Microscope,
  Shield,
  Stethoscope,
  Users,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function HospitalOnboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [hospitalData, setHospitalData] = useState({
    name: "",
    type: "",
    beds: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    adminName: user?.full_name || "",
    adminEmail: user?.email || "",
    adminPhone: "",
    departments: [
      "Emergency",
      "Cardiology",
      "Surgery",
      "Pediatrics",
      "Radiology",
      "Laboratory",
    ],
  });

  const handleInputChange = (field, value) => {
    setHospitalData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCompleteOnboarding = () => {
    // Here we would normally save the hospital setup information to the database
    toast({
      title: "Hospital setup complete!",
      description: "Redirecting you to your hospital administration dashboard.",
    });

    // Save onboarding completion status
    localStorage.setItem("onboardingComplete", "true");

    // Redirect to the dashboard
    setTimeout(() => {
      navigate("/hospital-admin");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Hospital className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            Hospital Administration Setup
          </CardTitle>
          <CardDescription>
            Configure your hospital management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <div className="flex justify-between relative">
              <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full border border-primary bg-background text-center font-medium text-primary">
                {currentStep > 1 ? <Check className="h-4 w-4" /> : "1"}
              </div>
              <div
                className={`absolute top-4 left-8 right-8 h-0.5 ${
                  currentStep > 1 ? "bg-primary" : "bg-muted"
                }`}
              />
              <div
                className={`z-10 flex h-8 w-8 items-center justify-center rounded-full ${
                  currentStep > 1
                    ? "border border-primary bg-background font-medium text-primary"
                    : "border border-muted bg-muted text-muted-foreground"
                }`}
              >
                {currentStep > 2 ? <Check className="h-4 w-4" /> : "2"}
              </div>
              <div
                className={`absolute top-4 left-[calc(50%+16px)] right-8 h-0.5 ${
                  currentStep > 2 ? "bg-primary" : "bg-muted"
                }`}
              />
              <div
                className={`z-10 flex h-8 w-8 items-center justify-center rounded-full ${
                  currentStep > 2
                    ? "border border-primary bg-background font-medium text-primary"
                    : "border border-muted bg-muted text-muted-foreground"
                }`}
              >
                {currentStep > 3 ? <Check className="h-4 w-4" /> : "3"}
              </div>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-primary font-medium">
                Hospital Information
              </span>
              <span
                className={
                  currentStep > 1
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }
              >
                Administrator Details
              </span>
              <span
                className={
                  currentStep > 2
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }
              >
                Configuration
              </span>
            </div>
          </div>

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hospital-name">Hospital Name</Label>
                <Input
                  id="hospital-name"
                  placeholder="General Hospital"
                  value={hospitalData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hospital-type">Hospital Type</Label>
                  <Select
                    value={hospitalData.type}
                    onValueChange={(value) => handleInputChange("type", value)}
                  >
                    <SelectTrigger id="hospital-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Hospital</SelectItem>
                      <SelectItem value="specialty">
                        Specialty Hospital
                      </SelectItem>
                      <SelectItem value="teaching">
                        Teaching Hospital
                      </SelectItem>
                      <SelectItem value="children">
                        Children's Hospital
                      </SelectItem>
                      <SelectItem value="rural">Rural Hospital</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bed-count">Number of Beds</Label>
                  <Input
                    id="bed-count"
                    type="number"
                    placeholder="e.g., 250"
                    value={hospitalData.beds}
                    onChange={(e) => handleInputChange("beds", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Hospital Address</Label>
                <Input
                  id="address"
                  placeholder="123 Medical Center Drive"
                  value={hospitalData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="City"
                    value={hospitalData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="State"
                    value={hospitalData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input
                    id="zip"
                    placeholder="ZIP Code"
                    value={hospitalData.zipCode}
                    onChange={(e) =>
                      handleInputChange("zipCode", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-name">Administrator Name</Label>
                <Input
                  id="admin-name"
                  placeholder="Full Name"
                  value={hospitalData.adminName}
                  onChange={(e) =>
                    handleInputChange("adminName", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-email">Email Address</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@hospital.com"
                  value={hospitalData.adminEmail}
                  onChange={(e) =>
                    handleInputChange("adminEmail", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-phone">Phone Number</Label>
                <Input
                  id="admin-phone"
                  placeholder="(555) 123-4567"
                  value={hospitalData.adminPhone}
                  onChange={(e) =>
                    handleInputChange("adminPhone", e.target.value)
                  }
                />
              </div>

              <div className="mt-4 p-4 border border-blue-200 bg-blue-50 rounded-md">
                <div className="flex">
                  <Shield className="h-5 w-5 text-blue-700 mr-2 shrink-0" />
                  <div>
                    <p className="text-sm text-blue-700 font-medium">
                      Administrator Permissions
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      As the primary administrator, you will have full access to
                      all system features. You can add additional administrators
                      and manage their permissions later.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Department Setup</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  These departments will be pre-configured in your hospital
                  system. You can add or modify departments later.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {hospitalData.departments.map((dept) => (
                    <div
                      key={dept}
                      className="flex items-center gap-2 border rounded-md p-2"
                    >
                      <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                        {dept === "Emergency" ? (
                          <Stethoscope className="h-4 w-4 text-primary" />
                        ) : dept === "Cardiology" ? (
                          <Stethoscope className="h-4 w-4 text-primary" />
                        ) : dept === "Surgery" ? (
                          <Stethoscope className="h-4 w-4 text-primary" />
                        ) : dept === "Radiology" ? (
                          <Microscope className="h-4 w-4 text-primary" />
                        ) : dept === "Laboratory" ? (
                          <Microscope className="h-4 w-4 text-primary" />
                        ) : (
                          <Building className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <span className="text-sm font-medium">{dept}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 border border-dashed rounded-md p-2">
                    <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center shrink-0">
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Add More Later
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <h3 className="text-lg font-medium">Review & Confirm</h3>
                <div className="bg-muted/50 rounded-lg p-4">
                  <dl className="space-y-2">
                    <div className="grid grid-cols-3 gap-1">
                      <dt className="text-sm font-medium text-muted-foreground">
                        Hospital Name:
                      </dt>
                      <dd className="text-sm col-span-2">
                        {hospitalData.name || "Not provided"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <dt className="text-sm font-medium text-muted-foreground">
                        Hospital Type:
                      </dt>
                      <dd className="text-sm col-span-2">
                        {hospitalData.type || "Not selected"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <dt className="text-sm font-medium text-muted-foreground">
                        Bed Count:
                      </dt>
                      <dd className="text-sm col-span-2">
                        {hospitalData.beds || "Not provided"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <dt className="text-sm font-medium text-muted-foreground">
                        Address:
                      </dt>
                      <dd className="text-sm col-span-2">
                        {hospitalData.address
                          ? `${hospitalData.address}, ${hospitalData.city}, ${hospitalData.state} ${hospitalData.zipCode}`
                          : "Not provided"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <dt className="text-sm font-medium text-muted-foreground">
                        Administrator:
                      </dt>
                      <dd className="text-sm col-span-2">
                        {hospitalData.adminName || "Not provided"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <dt className="text-sm font-medium text-muted-foreground">
                        Admin Contact:
                      </dt>
                      <dd className="text-sm col-span-2">
                        {hospitalData.adminEmail
                          ? `${hospitalData.adminEmail} / ${
                              hospitalData.adminPhone || "No phone"
                            }`
                          : "Not provided"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Back
            </Button>
          )}
          {currentStep < 3 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="ml-auto"
            >
              Continue
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleCompleteOnboarding} className="ml-auto">
              Complete Setup
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
