import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        console.log("Auth state changed, fetching user data");
        const { data: userData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        } else {
          console.log("User data fetched:", userData);
          setUser({
            id: userData.id,
            name: userData.full_name,
            email: userData.email,
            role: userData.role,
            isVerified: userData.is_verified,
            doctorCode: userData.doctor_code,
            avatarUrl: userData.avatar_url,
            specialization: userData.specialization,
          });
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const requestVerificationCode = async (licenseNumber) => {
    try {
      if (!user || user.role !== "doctor") {
        throw new Error("Only doctors can request verification");
      }

      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      const codeExpiry = new Date();
      codeExpiry.setHours(codeExpiry.getHours() + 1);

      const { error } = await supabase
        .from("doctor_verifications")
        .update({
          verification_code: verificationCode,
          code_expiry: codeExpiry.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("doctor_id", user.id)
        .eq("license_number", licenseNumber);

      if (error) throw error;

      const response = await supabase.functions.invoke(
        "send-verification-email",
        {
          body: {
            doctorId: user.id,
            email: user.email,
            licenseNumber: licenseNumber,
            verificationCode: verificationCode,
          },
        }
      );

      if (response.error) {
        console.error("Error sending verification email:", response.error);
        throw new Error("Failed to send verification email. Please try again.");
      }

      toast({
        title: "Verification Code Sent",
        description:
          "A verification code has been sent to your email address. Please check your inbox.",
      });

      return;
    } catch (error) {
      console.error("Verification code request error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to generate verification code. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const checkVerificationCode = async (verificationCode) => {
    try {
      if (!user || user.role !== "doctor") {
        throw new Error("Only doctors can verify codes");
      }

      const { data, error } = await supabase
        .from("doctor_verifications")
        .select("*")
        .eq("doctor_id", user.id)
        .eq("verification_code", verificationCode)
        .single();

      if (error || !data) {
        throw new Error("Invalid verification code");
      }

      const codeExpiry = new Date(data.code_expiry);
      if (codeExpiry < new Date()) {
        throw new Error("Verification code has expired");
      }

      const { error: updateError } = await supabase
        .from("doctor_verifications")
        .update({
          status: "verified",
          verification_date: new Date().toISOString(),
          verification_code: null,
          code_expiry: null,
        })
        .eq("id", data.id);

      if (updateError) throw updateError;

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ is_verified: true })
        .eq("id", user.id);

      if (profileError) throw profileError;

      setUser((prev) => (prev ? { ...prev, isVerified: true } : null));

      toast({
        title: "Verification Successful",
        description:
          "Your doctor account has been verified. You can now access the doctor dashboard.",
      });
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Verification Failed",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const verifyDoctorCode = async (code) => {
    try {
      if (user?.role === "doctor") {
        const { error } = await supabase
          .from("doctor_verifications")
          .update({
            status: "verified",
            verification_date: new Date().toISOString(),
          })
          .eq("doctor_id", user.id)
          .eq("license_number", code);

        if (error) throw error;

        const { error: profileError } = await supabase
          .from("profiles")
          .update({ is_verified: true })
          .eq("id", user.id);

        if (profileError) throw profileError;

        setUser((prev) => (prev ? { ...prev, isVerified: true } : null));

        toast({
          title: "Verification Successful",
          description: "Your doctor account has been verified.",
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Verification Failed",
        description: "Please check your code and try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const resetDoctorCode = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;

      toast({
        title: "Reset Code Sent",
        description:
          "Check your email for instructions to reset your doctor code.",
      });
    } catch (error) {
      console.error("Reset code error:", error);
      toast({
        title: "Reset Failed",
        description:
          "Unable to reset your doctor code. Please try again later.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateUserProfile = async (updates) => {
    try {
      if (!user) {
        throw new Error("You must be logged in to update your profile");
      }

      const profileUpdates = {};

      if (updates.name !== undefined) {
        profileUpdates.full_name = updates.name;
      }

      if (updates.email !== undefined) {
        profileUpdates.email = updates.email;
      }

      if (updates.avatarUrl !== undefined) {
        profileUpdates.avatar_url = updates.avatarUrl;
      }

      if (updates.specialization !== undefined && user.role === "doctor") {
        profileUpdates.specialization = updates.specialization;
      }

      const { error } = await supabase
        .from("profiles")
        .update(profileUpdates)
        .eq("id", user.id);

      if (error) throw error;

      setUser((prev) => (prev ? { ...prev, ...updates } : null));

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Update Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isDoctor: user?.role === "doctor",
        isVerifiedDoctor: user?.role === "doctor" && user?.isVerified,
        login,
        logout,
        verifyDoctorCode,
        resetDoctorCode,
        requestVerificationCode,
        checkVerificationCode,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
