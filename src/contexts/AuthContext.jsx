import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkInitialSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          fetchUserData(data.session.user.id);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Initial session check error:", error);
        setIsLoading(false);
      }
    };

    checkInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`Auth state changed: ${event}`, session);

      if (session) {
        fetchUserData(session.user.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserData = async (userId) => {
    try {
      console.log("Fetching user data for:", userId);
      const { data: userData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
        setIsLoading(false);
        return;
      }

      console.log("User data fetched:", userData);
      setUser({
        id: userData.id,
        name: userData.full_name,
        full_name: userData.full_name,
        email: userData.email,
        role: userData.role,
        isVerified: userData.is_verified,
        doctorCode: userData.doctor_code,
        avatarUrl: userData.avatar_url,
        specialization: userData.specialization,
        hospitalName: userData.hospital_name,
        hospitalId: userData.hospital_id,
      });
    } catch (error) {
      console.error("Error in fetchUserData:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return fetchUserData(data.user.id);
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Something went wrong",
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
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
      throw error;
    }
  };

  const verifyDoctorCode = async (code) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const { data, error } = await supabase
        .from("doctor_verifications")
        .select("*")
        .eq("doctor_id", user.id)
        .eq("verification_code", code)
        .single();

      if (error || !data) throw new Error("Invalid verification code");

      const { error: updateError } = await supabase
        .from("doctor_verifications")
        .update({
          status: "verified",
          verification_date: new Date().toISOString(),
        })
        .eq("doctor_id", user.id);

      if (updateError) throw updateError;

      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update({ is_verified: true })
        .eq("id", user.id);

      if (profileUpdateError) throw profileUpdateError;

      await fetchUserData(user.id);

      toast({
        title: "Verification successful",
        description: "Your doctor account has been verified.",
      });
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Verification failed",
        description: error.message || "Invalid verification code",
        variant: "destructive",
      });
      throw error;
    }
  };

  const resetDoctorCode = async (userId) => {
    try {
      const verificationCode = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);

      const { error } = await supabase
        .from("doctor_verifications")
        .update({
          verification_code: verificationCode,
          code_expiry: expiryDate.toISOString(),
        })
        .eq("doctor_id", userId);

      if (error) throw error;

      return verificationCode;
    } catch (error) {
      console.error("Reset doctor code error:", error);
      toast({
        title: "Failed to reset verification code",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
      throw error;
    }
  };

  const checkVerificationCode = async (verificationCode) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const { data, error } = await supabase
        .from("doctor_verifications")
        .select("*")
        .eq("doctor_id", user.id)
        .eq("verification_code", verificationCode)
        .single();

      if (error || !data) throw new Error("Invalid verification code");

      if (data.code_expiry && new Date(data.code_expiry) < new Date()) {
        throw new Error("Verification code has expired");
      }

      return data;
    } catch (error) {
      console.error("Check verification code error:", error);
      toast({
        title: "Verification failed",
        description: error.message || "Invalid or expired code",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateUserProfile = async (updates) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const profileUpdates = {};

      if (updates.name || updates.full_name) {
        profileUpdates.full_name = updates.name || updates.full_name;
      }

      if (updates.specialization) {
        profileUpdates.specialization = updates.specialization;
      }

      if (updates.avatarUrl) {
        profileUpdates.avatar_url = updates.avatarUrl;
      }

      const { error } = await supabase
        .from("profiles")
        .update(profileUpdates)
        .eq("id", user.id);

      if (error) throw error;

      await fetchUserData(user.id);

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Update profile error:", error);
      toast({
        title: "Update failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getDoctorVerificationStatus = async () => {
    if (!user) throw new Error("User not authenticated");
    if (user.role !== "doctor") throw new Error("User is not a doctor");

    try {
      const { data, error } = await supabase
        .from("doctor_verifications")
        .select("status")
        .eq("doctor_id", user.id)
        .single();

      if (error) throw error;

      return data.status === "verified";
    } catch (error) {
      console.error("Get verification status error:", error);
      return false;
    }
  };

  const getVerificationDetails = async () => {
    if (!user) throw new Error("User not authenticated");
    if (user.role !== "doctor") throw new Error("User is not a doctor");

    try {
      const { data, error } = await supabase
        .from("doctor_verifications")
        .select("*")
        .eq("doctor_id", user.id)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Get verification details error:", error);
      toast({
        title: "Failed to get verification details",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
      throw error;
    }
  };

  const isAuthenticated = user !== null;
  const isDoctor = user?.role === "doctor";
  const isVerifiedDoctor = isDoctor && user?.isVerified === true;
  const isHospitalAdmin = user?.role === "hospital_admin";

  const value = {
    user,
    isLoading,
    isAuthenticated,
    isDoctor,
    isVerifiedDoctor,
    isHospitalAdmin,
    login,
    logout,
    verifyDoctorCode,
    resetDoctorCode,
    checkVerificationCode,
    updateUserProfile,
    getDoctorVerificationStatus,
    getVerificationDetails,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
