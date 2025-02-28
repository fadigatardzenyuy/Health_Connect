import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const { toast } = useToast();

  // Initial auth state check - runs only once
  useEffect(() => {
    const checkInitialAuthState = async () => {
      try {
        // Get current session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          const { data: userData, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (!error && userData) {
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
          } else {
            // Handle case where profile doesn't exist yet but user is authenticated
            const userMeta = session.user.user_metadata || {};

            try {
              // Create profile if it doesn't exist
              const profileData = {
                id: session.user.id,
                email: session.user.email,
                full_name: userMeta.full_name || "",
                role: userMeta.role || "patient",
                is_verified: false,
                avatar_url: null,
                doctor_code: userMeta.license_number || null,
                specialization: userMeta.specialization || null,
              };

              await supabase.from("profiles").insert([profileData]);

              // Set user with available data
              setUser({
                id: session.user.id,
                name: userMeta.full_name || "",
                email: session.user.email,
                role: userMeta.role || "patient",
                isVerified: false,
                doctorCode: userMeta.license_number || null,
                avatarUrl: null,
                specialization: userMeta.specialization || null,
              });
            } catch (createError) {
              console.error("Error creating profile:", createError);
            }
          }
        }
      } catch (error) {
        console.error("Error checking initial auth state:", error);
      } finally {
        setIsLoading(false);
        setAuthInitialized(true);
      }
    };

    checkInitialAuthState();
  }, []);

  // Auth state listener - only set up after initial check
  useEffect(() => {
    if (!authInitialized) return;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change event:", event); // Better logging

      // Set loading to true only for sign-in/sign-up events
      if (event === "SIGNED_IN" || event === "SIGNED_UP") {
        setIsLoading(true);
      }

      if (session) {
        console.log("Auth state changed, fetching user data");
        const { data: userData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Error fetching user data:", error);

          // Special handling for new signups - the profile might not exist yet on mobile
          // due to race conditions, so we'll create it from session metadata
          if (event === "SIGNED_UP" || event === "SIGNED_IN") {
            const userMeta = session.user.user_metadata || {};

            try {
              // Create profile if it doesn't exist
              const profileData = {
                id: session.user.id,
                email: session.user.email,
                full_name: userMeta.full_name || "",
                role: userMeta.role || "patient",
                is_verified: false,
                avatar_url: null,
                doctor_code: userMeta.license_number || null,
                specialization: userMeta.specialization || null,
              };

              await supabase.from("profiles").insert([profileData]);

              // Set user with available data
              setUser({
                id: session.user.id,
                name: userMeta.full_name || "",
                email: session.user.email,
                role: userMeta.role || "patient",
                isVerified: false,
                doctorCode: userMeta.license_number || null,
                avatarUrl: null,
                specialization: userMeta.specialization || null,
              });
            } catch (createError) {
              console.error("Error creating profile:", createError);
              setUser(null);
            }
          } else {
            setUser(null);
          }
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
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }

      // Only update loading state if we explicitly set it to true earlier
      if (isLoading) {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [authInitialized, isLoading]);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Ensure proper navigation on mobile - force the redirect after login
      const { data: userData } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      // Return role for navigation purposes
      return userData?.role || "patient";
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false); // Make sure to reset loading on error
      throw error;
    }
  };

  const signup = async (email, password, userData) => {
    try {
      setIsLoading(true);

      // Attempt signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.fullName,
            role: userData.role,
            ...(userData.role === "doctor" && {
              license_number: userData.license,
              specialization: userData.specialization,
            }),
          },
        },
      });

      if (error) throw error;

      // Create profile entry explicitly
      const profileData = {
        id: data.user.id,
        email: email,
        full_name: userData.fullName,
        role: userData.role,
        is_verified: false,
        avatar_url: null,
        specialization: userData.specialization || null,
        doctor_code: userData.role === "doctor" ? userData.license : null,
      };

      const { error: profileError } = await supabase
        .from("profiles")
        .insert([profileData]);

      if (profileError) {
        console.error("Profile creation error:", profileError);
        // Continue even if profile creation fails, we'll handle it in auth state change
      }

      // If doctor, create verification record
      if (userData.role === "doctor" && userData.license) {
        const { error: verificationError } = await supabase
          .from("doctor_verifications")
          .insert([
            {
              doctor_id: data.user.id,
              license_number: userData.license,
              status: "pending",
            },
          ]);

        if (verificationError) {
          console.error(
            "Doctor verification record creation error:",
            verificationError
          );
          // Continue even if verification creation fails
        }
      }

      // Set user explicitly so we don't have to wait for auth state change
      setUser({
        id: data.user.id,
        name: userData.fullName,
        email: email,
        role: userData.role,
        isVerified: false,
        doctorCode: userData.role === "doctor" ? userData.license : null,
        avatarUrl: null,
        specialization: userData.specialization || null,
      });

      toast({
        title: "Account created successfully",
        description:
          userData.role === "doctor"
            ? "Please complete your doctor verification process"
            : "Welcome to Health Connect!",
      });

      return { user: data.user, role: userData.role };
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Error",
        description:
          error.message ||
          "An error occurred during sign up. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
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

  const checkVerificationCode = async (verificationCode) => {
    try {
      if (!user || user.role !== "doctor") {
        throw new Error("Only doctors can verify codes");
      }

      // Get the verification record
      const { data, error } = await supabase
        .from("doctor_verifications")
        .select("*")
        .eq("doctor_id", user.id)
        .eq("verification_code", verificationCode)
        .single();

      if (error || !data) {
        throw new Error("Invalid verification code");
      }

      // Check if code is expired
      const codeExpiry = new Date(data.code_expiry);
      if (codeExpiry < new Date()) {
        throw new Error("Verification code has expired");
      }

      // Update verification status
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

      // Update user profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ is_verified: true })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Update local user state
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

        // Update user verification status
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
      if (!user || user.role !== "doctor") {
        throw new Error("Only doctors can reset verification codes");
      }

      // Generate a new code
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      // Set code expiry to 24 hours from now
      const codeExpiry = new Date();
      codeExpiry.setHours(codeExpiry.getHours() + 24);

      // Update doctor_verifications table with the new code
      const { error } = await supabase
        .from("doctor_verifications")
        .update({
          verification_code: verificationCode,
          code_expiry: codeExpiry.toISOString(),
        })
        .eq("doctor_id", user.id);

      if (error) throw error;

      toast({
        title: "Verification Code Reset",
        description: `Your new verification code is: ${verificationCode}`,
      });
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

  const updateUserProfile = async (updates) => {
    try {
      if (!user) {
        throw new Error("You must be logged in to update your profile");
      }

      // Transform the updates to match the database column names
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

      // Update the profile in the database
      const { error } = await supabase
        .from("profiles")
        .update(profileUpdates)
        .eq("id", user.id);

      if (error) throw error;

      // Update local user state
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
        signup, // Added new signup function
        verifyDoctorCode,
        resetDoctorCode,
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
