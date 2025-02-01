import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Simulated authentication - replace with real auth logic
  const login = async (email, password) => {
    // Simulate API call
    const mockUser = {
      id: "1",
      name: "Dr. Sarah Johnson",
      email: email,
      role: "doctor",
      isVerified: true,
      doctorCode: "123456",
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  const verifyDoctorCode = async (code) => {
    try {
      // Simulate API verification
      if (user?.role === "doctor") {
        setUser((prev) => (prev ? { ...prev, isVerified: true } : null));
        toast({
          title: "Verification Successful",
          description: "Your doctor account has been verified.",
        });
      }
    } catch (error) {
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
      // Simulate API call for code reset
      toast({
        title: "Reset Code Sent",
        description:
          "Check your email for instructions to reset your doctor code.",
      });
    } catch (error) {
      toast({
        title: "Reset Failed",
        description:
          "Unable to reset your doctor code. Please try again later.",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    // Simulate loading user data
    setIsLoading(false);
  }, []);

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
