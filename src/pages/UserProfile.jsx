import { useEffect, useState, useRef } from "react";
import { Layout } from "@/components/Layout";
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
  User,
  Mail,
  CalendarClock,
  Award,
  FileEdit,
  Save,
  ShieldCheck,
  BookOpen,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const UserProfile = () => {
  const { toast } = useToast();
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatarUrl: "",
    specialization: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        avatarUrl: user.avatarUrl || "",
        specialization: user.specialization || "",
      });
      setIsLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateUserProfile({
        name: formData.name,
        email: formData.email,
        avatarUrl: formData.avatarUrl,
        specialization: formData.specialization,
      });

      setIsEditing(false);

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${user?.id}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    setIsUploading(true);

    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const avatarBucketExists = buckets?.some(
        (bucket) => bucket.name === "avatars"
      );

      if (!avatarBucketExists) {
        await supabase.storage.createBucket("avatars", {
          public: true,
        });
      }

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, avatarUrl: data.publicUrl }));

      toast({
        title: "Avatar Uploaded",
        description: "Your avatar has been uploaded successfully.",
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeAvatar = () => {
    setFormData((prev) => ({ ...prev, avatarUrl: "" }));
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh] col-span-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="col-span-12">
          <Card className="border-none shadow-md">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center p-8 gap-4">
                <User className="h-16 w-16 text-gray-300" />
                <p className="text-center text-lg font-medium">
                  Please sign in to view your profile.
                </p>
                <Button className="mt-2">Sign In</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="col-span-12 md:col-span-10 md:col-start-2 lg:col-span-8 lg:col-start-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Profile Header Card */}
          <Card className="md:col-span-12 border-none shadow-md bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <Avatar
                    className={`h-24 w-24 md:h-32 md:w-32 ring-4 ring-white shadow-lg cursor-${
                      isEditing ? "pointer" : "default"
                    } ${isEditing ? "hover:opacity-80" : ""}`}
                    onClick={handleAvatarClick}
                  >
                    {isUploading ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                      </div>
                    ) : (
                      <>
                        <AvatarImage
                          src={formData.avatarUrl}
                          alt={formData.name}
                        />
                        <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                          {formData.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase() || "?"}
                        </AvatarFallback>

                        {isEditing && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 rounded-full transition-opacity">
                            <Camera className="h-8 w-8 text-white" />
                          </div>
                        )}
                      </>
                    )}
                  </Avatar>

                  {isEditing && formData.avatarUrl && (
                    <button
                      type="button"
                      onClick={removeAvatar}
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
                        {user.name}
                      </h2>
                      <p className="text-gray-500 flex items-center justify-center md:justify-start gap-1 mt-1">
                        <Mail className="h-4 w-4" /> {user.email}
                      </p>
                    </div>

                    <div className="flex gap-2 justify-center md:justify-end">
                      {user.role === "doctor" && (
                        <Badge
                          variant={user.isVerified ? "default" : "outline"}
                          className="px-3 py-1"
                        >
                          <div className="flex items-center gap-1">
                            {user.isVerified ? (
                              <ShieldCheck className="h-4 w-4" />
                            ) : null}
                            {user.isVerified ? "Verified Doctor" : "Doctor"}
                          </div>
                        </Badge>
                      )}
                      {user.role === "patient" && (
                        <Badge variant="secondary" className="px-3 py-1">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            Patient
                          </div>
                        </Badge>
                      )}
                    </div>
                  </div>

                  {user.role === "doctor" &&
                    user.specialization &&
                    !isEditing && (
                      <div className="mt-3 flex items-center gap-1 justify-center md:justify-start">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        <span className="text-gray-700">
                          {user.specialization}
                        </span>
                      </div>
                    )}

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

          {/* Profile Content */}
          <div className="md:col-span-12">
            {isEditing ? (
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileEdit className="h-5 w-5" /> Edit Your Profile
                  </CardTitle>
                  <CardDescription>
                    Update your personal information and profile settings
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
                          <User className="h-4 w-4 text-gray-500" /> Full Name
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

                    {user.role === "doctor" && (
                      <div className="space-y-2">
                        <Label
                          htmlFor="specialization"
                          className="text-sm font-medium flex items-center gap-2"
                        >
                          <BookOpen className="h-4 w-4 text-gray-500" />{" "}
                          Specialization
                        </Label>
                        <Textarea
                          id="specialization"
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleChange}
                          placeholder="e.g., Cardiology, Neurology, General Practice"
                          className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                        />
                      </div>
                    )}

                    <Separator />

                    <div className="flex justify-end space-x-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          if (user) {
                            setFormData({
                              name: user.name || "",
                              email: user.email || "",
                              avatarUrl: user.avatarUrl || "",
                              specialization: user.specialization || "",
                            });
                          }
                        }}
                        className="border-gray-300"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Save className="h-4 w-4 mr-2" /> Save Changes
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-none shadow-md">
                {/* HERE IS THE FIX: Moving Tabs to wrap both TabsList and TabsContent */}
                <Tabs
                  defaultValue="info"
                  className="w-full"
                  onValueChange={setActiveTab}
                >
                  <CardHeader className="pb-2">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="info" className="text-sm">
                        Profile Information
                      </TabsTrigger>
                      <TabsTrigger value="activity" className="text-sm">
                        Activity & Settings
                      </TabsTrigger>
                    </TabsList>
                  </CardHeader>
                  <CardContent>
                    <TabsContent value="info" className="mt-4 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-gray-800">
                            Personal Information
                          </h3>

                          <div className="space-y-4">
                            <div className="flex flex-col space-y-1">
                              <span className="text-sm text-gray-500 flex items-center gap-1">
                                <User className="h-4 w-4" /> Full Name
                              </span>
                              <span className="font-medium">{user.name}</span>
                            </div>

                            <div className="flex flex-col space-y-1">
                              <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Mail className="h-4 w-4" /> Email Address
                              </span>
                              <span className="font-medium">{user.email}</span>
                            </div>

                            <div className="flex flex-col space-y-1">
                              <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Award className="h-4 w-4" /> Account Type
                              </span>
                              <span className="font-medium capitalize">
                                {user.role}
                              </span>
                            </div>
                          </div>
                        </div>

                        {user.role === "doctor" && (
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-800">
                              Professional Information
                            </h3>

                            <div className="space-y-4">
                              <div className="flex flex-col space-y-1">
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                  <BookOpen className="h-4 w-4" />{" "}
                                  Specialization
                                </span>
                                <span className="font-medium">
                                  {user.specialization || "Not specified"}
                                </span>
                              </div>

                              <div className="flex flex-col space-y-1">
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                  <ShieldCheck className="h-4 w-4" />{" "}
                                  Verification Status
                                </span>
                                <div>
                                  {user.isVerified ? (
                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                      Verified
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className="text-yellow-600 border-yellow-300"
                                    >
                                      Pending Verification
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="activity" className="mt-4">
                      <div className="space-y-6">
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <h3 className="text-lg font-medium text-gray-800 mb-4">
                            Account Activity
                          </h3>
                          <p className="text-gray-600">
                            Activity tracking and account settings will be
                            available soon.
                          </p>

                          <div className="mt-6 flex justify-center">
                            <Button
                              variant="outline"
                              className="border-dashed border-gray-300"
                            >
                              Coming Soon
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </CardContent>

                  <CardFooter className="pt-0 flex justify-end">
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <FileEdit className="h-4 w-4 mr-2" /> Edit Profile
                    </Button>
                  </CardFooter>
                </Tabs>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
