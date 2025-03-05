import { createContext, useContext } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuthState } from "@/hooks/useAuthState";
import {
  loginUser,
  logoutUser,
  verifyDoctorCode,
  checkVerificationCode,
  resetDoctorVerificationCode,
  updateUserProfile,
  checkDoctorVerificationStatus,
  getDoctorVerificationDetails,
} from "@/services/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { user, setUser, isLoading } = useAuthState();
  const { toast } = useToast();

  const login = async (email, password) => {
    try {
      await loginUser(email, password);
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
      await logoutUser();
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

  const handleDoctorCode = async (code) => {
    try {
      if (!user || user.role !== "doctor") {
        throw new Error("Only doctors can verify codes");
      }

      console.log("Verifying doctor code:", code, "for user:", user.id);
      await verifyDoctorCode(code, user.id);

      // Update local user state
      setUser((prev) => (prev ? { ...prev, isVerified: true } : null));

      toast({
        title: "Verification Successful",
        description: "Your doctor account has been verified.",
      });
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Verification Failed",
        description:
          error instanceof Error
            ? error.message
            : "Please check your code and try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleVerificationCode = async (verificationCode) => {
    try {
      if (!user || user.role !== "doctor") {
        throw new Error("Only doctors can verify codes");
      }

      console.log("Checking verification code:", verificationCode);
      await checkVerificationCode(verificationCode, user.id);

      // Update local user state
      setUser((prev) => (prev ? { ...prev, isVerified: true } : null));

      toast({
        title: "Verification Successful",
        description: "Your doctor account has been verified.",
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

  const handleResetCode = async (userId) => {
    try {
      if (!user || user.role !== "doctor") {
        throw new Error("Only doctors can reset verification codes");
      }

      console.log("Resetting verification code for doctor:", user.id);
      const verificationCode = await resetDoctorVerificationCode(userId);

      toast({
        title: "Verification Code Reset",
        description: `Your new verification code is: ${verificationCode}`,
      });

      return verificationCode;
    } catch (error) {
      console.error("Reset code error:", error);
      toast({
        title: "Reset Failed",
        description:
          "Unable to reset your verification code. Please try again later.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleUpdateProfile = async (updates) => {
    try {
      if (!user) {
        throw new Error("You must be logged in to update your profile");
      }

      await updateUserProfile(user.id, updates);
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

  const getDoctorVerificationStatus = async () => {
    if (!user || user.role !== "doctor") {
      return false;
    }

    try {
      return await checkDoctorVerificationStatus(user.id);
    } catch (error) {
      console.error("Error checking verification status:", error);
      return false;
    }
  };

  const getVerificationDetails = async () => {
    if (!user || user.role !== "doctor") {
      return null;
    }

    try {
      return await getDoctorVerificationDetails(user.id);
    } catch (error) {
      console.error("Error getting verification details:", error);
      return null;
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
        verifyDoctorCode: handleDoctorCode,
        resetDoctorCode: handleResetCode,
        checkVerificationCode: handleVerificationCode,
        updateUserProfile: handleUpdateProfile,
        getDoctorVerificationStatus,
        getVerificationDetails,
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
