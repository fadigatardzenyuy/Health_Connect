import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const { data: userData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) {
          setUser(null);
        } else {
          setUser({
            id: userData.id,
            name: userData.full_name,
            email: userData.email,
            role: userData.role,
            isVerified: userData.is_verified,
            doctorCode: userData.doctor_code,
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
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
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
      toast({
        title: "Reset Failed",
        description:
          "Unable to reset your doctor code. Please try again later.",
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
