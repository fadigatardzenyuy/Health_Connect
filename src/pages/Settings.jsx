import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Bell, Moon, Sun, Globe } from "lucide-react";

const Settings = () => {
  const { toast } = useToast();

  const handleSettingChange = (setting) => {
    toast({
      title: "Setting Updated",
      description: `${setting} setting has been updated.`,
    });
  };

  return (
    <Layout>
      <div className="col-span-12">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notifications</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Bell className="h-5 w-5" />
                  <Label htmlFor="notifications">Push Notifications</Label>
                </div>
                <Switch
                  id="notifications"
                  onCheckedChange={() => handleSettingChange("Notifications")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Bell className="h-5 w-5" />
                  <Label htmlFor="email-notifications">
                    Email Notifications
                  </Label>
                </div>
                <Switch
                  id="email-notifications"
                  onCheckedChange={() =>
                    handleSettingChange("Email notifications")
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Appearance</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Moon className="h-5 w-5" />
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                </div>
                <Switch
                  id="dark-mode"
                  onCheckedChange={() => handleSettingChange("Dark mode")}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Language</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Globe className="h-5 w-5" />
                  <Label>Preferred Language</Label>
                </div>
                <select
                  className="rounded-md border border-input bg-background px-3 py-2"
                  onChange={() => handleSettingChange("Language")}
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  toast({
                    title: "Settings Saved",
                    description: "Your settings have been successfully saved.",
                  })
                }
              >
                Save All Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
