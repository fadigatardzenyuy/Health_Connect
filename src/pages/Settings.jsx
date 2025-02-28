import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Bell,
  Moon,
  Sun,
  Globe,
  Settings as SettingsIcon,
  Lock,
  User,
  Eye,
  Shield,
  Download,
  Trash,
  Mail,
  HelpCircle,
} from "lucide-react";
import { useState } from "react";

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: false,
    darkMode: false,
    language: "en",
    twoFactorAuth: false,
    activityVisibility: "public",
    dataSharing: false,
    highContrastMode: false,
    fontSize: "medium",
  });
  const [isDirty, setIsDirty] = useState(false); // Track if settings have been modified

  const handleSettingChange = (setting, value) => {
    setSettings((prev) => ({ ...prev, [setting]: value }));
    setIsDirty(true); // Mark settings as modified
    toast({
      title: "Setting Updated",
      description: `${setting.replace(
        /([A-Z])/g,
        " $1"
      )} setting has been updated.`,
    });
  };

  const handleSaveChanges = () => {
    setIsDirty(false); // Reset dirty state
    toast({
      title: "Settings Saved",
      description: "Your settings have been successfully saved.",
    });
  };

  const handleResetToDefault = () => {
    setSettings({
      pushNotifications: true,
      emailNotifications: false,
      darkMode: false,
      language: "en",
      twoFactorAuth: false,
      activityVisibility: "public",
      dataSharing: false,
      highContrastMode: false,
      fontSize: "medium",
    });
    setIsDirty(false); // Reset dirty state
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default.",
    });
  };

  const handleClearCache = () => {
    toast({
      title: "Cache Cleared",
      description: "App cache has been successfully cleared.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Data Exported",
      description: "Your data has been exported successfully.",
    });
  };

  const handleContactSupport = () => {
    toast({
      title: "Support Contacted",
      description: "Our support team will reach out to you shortly.",
    });
  };

  return (
    <Layout>
      <div className="col-span-12">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <SettingsIcon className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Settings</CardTitle>
                <CardDescription>
                  Customize your app experience and preferences.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Account Settings */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Account</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-4">
                    <User className="h-5 w-5 text-primary" />
                    <div>
                      <Label>Update Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Change your account email address.
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Change Email</Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-4">
                    <Lock className="h-5 w-5 text-primary" />
                    <div>
                      <Label>Update Password</Label>
                      <p className="text-sm text-muted-foreground">
                        Change your account password.
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Change Password</Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-4">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account.
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(value) =>
                      handleSettingChange("twoFactorAuth", value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-4">
                    <Bell className="h-5 w-5 text-primary" />
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications on your device.
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(value) =>
                      handleSettingChange("pushNotifications", value)
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-4">
                    <Bell className="h-5 w-5 text-primary" />
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email.
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(value) =>
                      handleSettingChange("emailNotifications", value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Privacy</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-4">
                    <Eye className="h-5 w-5 text-primary" />
                    <div>
                      <Label>Activity Visibility</Label>
                      <p className="text-sm text-muted-foreground">
                        Control who can see your activity.
                      </p>
                    </div>
                  </div>
                  <select
                    className="rounded-md border border-input bg-background px-3 py-2"
                    value={settings.activityVisibility}
                    onChange={(e) =>
                      handleSettingChange("activityVisibility", e.target.value)
                    }
                  >
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-4">
                    <Globe className="h-5 w-5 text-primary" />
                    <div>
                      <Label>Data Sharing</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow us to collect anonymous usage data.
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.dataSharing}
                    onCheckedChange={(value) =>
                      handleSettingChange("dataSharing", value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Advanced</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-4">
                    <Trash className="h-5 w-5 text-primary" />
                    <div>
                      <Label>Clear Cache</Label>
                      <p className="text-sm text-muted-foreground">
                        Free up storage by clearing cached data.
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleClearCache}>
                    Clear Cache
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-4">
                    <Download className="h-5 w-5 text-primary" />
                    <div>
                      <Label>Export Data</Label>
                      <p className="text-sm text-muted-foreground">
                        Download a copy of your data.
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleExportData}>
                    Export Data
                  </Button>
                </div>
              </div>
            </div>

            {/* Save and Reset Buttons */}
            {isDirty && (
              <div className="flex justify-end space-x-4 pt-6">
                <Button variant="outline" onClick={handleResetToDefault}>
                  Reset to Default
                </Button>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
