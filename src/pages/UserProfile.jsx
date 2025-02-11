import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const UserProfile = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    avatar_url: "",
  });

  useEffect(() => {
    async function fetchUserProfile() {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (data) {
          setUserData({
            name: data.full_name || "",
            email: data.email || "",
            avatar_url: data.avatar_url || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserProfile();
  }, [user?.id, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      const formData = new FormData(e.currentTarget);
      const newName = formData.get("name");
      const newEmail = formData.get("email");

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: newName,
          email: newEmail,
        })
        .eq("id", user.id);

      if (error) throw error;

      setUserData({
        ...userData,
        name: newName,
        email: newEmail,
      });

      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="col-span-12">
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4 mb-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={userData.avatar_url} alt={userData.name} />
                <AvatarFallback>{userData.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              {!isEditing && (
                <div className="text-center">
                  <h2 className="text-2xl font-bold">{userData.name}</h2>
                  <p className="text-gray-500">{userData.email}</p>
                </div>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={userData.name}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={userData.email}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
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
