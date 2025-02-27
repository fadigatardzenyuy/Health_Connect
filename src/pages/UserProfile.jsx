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
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Upload, X, Camera } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const UserProfile = () => {
  const { toast } = useToast();
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
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
          <Card>
            <CardContent className="pt-6">
              <p className="text-center">
                Please sign in to view your profile.
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="col-span-12 md:col-span-8 md:col-start-3 lg:col-span-6 lg:col-start-4">
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>
              {isEditing
                ? "Edit your personal information below"
                : "View and manage your profile information"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4 mb-6">
              <div className="relative">
                <Avatar
                  className={`h-32 w-32 cursor-${
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
                      <AvatarFallback className="text-2xl">
                        {formData.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase() || "?"}
                      </AvatarFallback>

                      {isEditing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 rounded-full transition-opacity">
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
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
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

              {!isEditing && (
                <div className="text-center">
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-gray-500">{user.email}</p>
                  {user.role === "doctor" && (
                    <div className="mt-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {user.isVerified ? "Verified Doctor" : "Doctor"}
                      </span>
                      {user.specialization && (
                        <p className="mt-1 text-sm text-gray-600">
                          {user.specialization}
                        </p>
                      )}
                    </div>
                  )}
                  {user.role === "patient" && (
                    <div className="mt-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Patient
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {user.role === "doctor" && (
                  <div className="space-y-2">
                    <label
                      htmlFor="specialization"
                      className="text-sm font-medium"
                    >
                      Specialization
                    </label>
                    <Textarea
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      placeholder="e.g., Cardiology, Neurology, General Practice"
                      rows={2}
                    />
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-2">
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
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            ) : (
              <div className="flex justify-center">
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default UserProfile;
