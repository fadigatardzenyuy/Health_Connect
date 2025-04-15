import { useState } from "react";
import { AdminLayout } from "@/components/hospital-admin/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building,
  Save,
  Upload,
  MapPin,
  Phone,
  AtSign,
  Globe,
  ShieldCheck,
  Settings,
  Users,
  BellRing,
  Clock, // Missing Clock import added
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";

export default function HospitalSettings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);

  // Mock hospital data
  const [hospitalData, setHospitalData] = useState({
    name: "Bamenda Regional Hospital",
    logo: "",
    description:
      "A leading healthcare facility serving the North-West Region of Cameroon.",
    address: "Hospital Road, Bamenda, North-West Region",
    phone: "+237 654 123 456",
    email: "info@bamandaregional.cm",
    website: "https://bamandaregional.cm",
    operatingHours: "24/7",
    emergencyContact: "+237 654 789 123",
    establishedYear: "1985",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    appointmentReminders: true,
    systemUpdates: true,
    marketingCommunications: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHospitalData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleChange = (name, checked) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSaveGeneral = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Settings saved",
        description: "Your hospital information has been updated successfully.",
      });
    }, 1000);
  };

  const handleSaveNotifications = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Notification settings saved",
        description: "Your notification preferences have been updated.",
      });
    }, 1000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Hospital Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your hospital information and preferences
            </p>
          </div>
        </div>

        <Tabs
          defaultValue="general"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid grid-cols-1 md:grid-cols-3 w-full md:w-auto">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              General Information
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2"
            >
              <BellRing className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Security & Access
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hospital Profile</CardTitle>
                <CardDescription>
                  Update your hospital's basic information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3 flex flex-col items-center">
                    <div className="mb-4">
                      <Avatar className="h-32 w-32">
                        <AvatarImage
                          src={hospitalData.logo || "/placeholder.svg"}
                          alt={hospitalData.name}
                        />
                        <AvatarFallback className="text-3xl">
                          {hospitalData.name
                            .split(" ")
                            .map((name) => name[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Logo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Recommended: 400x400px, max 2MB
                    </p>
                  </div>

                  <div className="md:w-2/3 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Hospital Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={hospitalData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="establishedYear">
                          Established Year
                        </Label>
                        <Input
                          id="establishedYear"
                          name="establishedYear"
                          value={hospitalData.establishedYear}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={hospitalData.description}
                        onChange={handleInputChange}
                        rows={4}
                      />
                      <p className="text-xs text-muted-foreground">
                        Brief description of your hospital, services offered,
                        and specialties.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Update contact details for your hospital
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="address"
                      className="flex items-center gap-2"
                    >
                      <MapPin className="h-4 w-4" />
                      Address
                    </Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={hospitalData.address}
                      onChange={handleInputChange}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="operatingHours"
                      className="flex items-center gap-2"
                    >
                      <Clock className="h-4 w-4" />
                      Operating Hours
                    </Label>
                    <Input
                      id="operatingHours"
                      name="operatingHours"
                      value={hospitalData.operatingHours}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={hospitalData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="emergencyContact"
                      className="flex items-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      Emergency Contact
                    </Label>
                    <Input
                      id="emergencyContact"
                      name="emergencyContact"
                      value={hospitalData.emergencyContact}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <AtSign className="h-4 w-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={hospitalData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="website"
                      className="flex items-center gap-2"
                    >
                      <Globe className="h-4 w-4" />
                      Website
                    </Label>
                    <Input
                      id="website"
                      name="website"
                      value={hospitalData.website}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveGeneral} disabled={saving}>
                  {saving ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        handleToggleChange("emailNotifications", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="smsNotifications">
                        SMS Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via SMS
                      </p>
                    </div>
                    <Switch
                      id="smsNotifications"
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) =>
                        handleToggleChange("smsNotifications", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="appointmentReminders">
                        Appointment Reminders
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Send reminders to patients before appointments
                      </p>
                    </div>
                    <Switch
                      id="appointmentReminders"
                      checked={notificationSettings.appointmentReminders}
                      onCheckedChange={(checked) =>
                        handleToggleChange("appointmentReminders", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="systemUpdates">System Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about system updates and
                        maintenance
                      </p>
                    </div>
                    <Switch
                      id="systemUpdates"
                      checked={notificationSettings.systemUpdates}
                      onCheckedChange={(checked) =>
                        handleToggleChange("systemUpdates", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketingCommunications">
                        Marketing Communications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive promotional and marketing communications
                      </p>
                    </div>
                    <Switch
                      id="marketingCommunications"
                      checked={notificationSettings.marketingCommunications}
                      onCheckedChange={(checked) =>
                        handleToggleChange("marketingCommunications", checked)
                      }
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveNotifications} disabled={saving}>
                  {saving ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Preferences
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security & Access</CardTitle>
                <CardDescription>
                  Manage account security and access controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="pb-4 border-b">
                    <h3 className="text-lg font-medium mb-2">Access Control</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Manage user roles and permissions for your hospital
                      account
                    </p>
                    <Button variant="outline">
                      <Users className="mr-2 h-4 w-4" />
                      Manage Staff Access
                    </Button>
                  </div>

                  <div className="pb-4 border-b">
                    <h3 className="text-lg font-medium mb-2">
                      Password Security
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Update your account password and security settings
                    </p>
                    <Button variant="outline">
                      <Settings className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add an extra layer of security to your account
                    </p>
                    <Button variant="outline">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Set Up 2FA
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
