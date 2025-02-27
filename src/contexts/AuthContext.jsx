import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

// Create context with default values to improve type safety
const AuthContext = createContext({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isDoctor: false,
  isVerifiedDoctor: false,
  login: async () => {},
  logout: async () => {},
  verifyDoctorCode: async () => {},
  resetDoctorCode: async () => {},
  requestVerificationCode: async () => {},
  checkVerificationCode: async () => {},
  updateUserProfile: async () => {},
});

// Constants
const VERIFICATION_CODE_EXPIRY_HOURS = 1;
const VERIFICATION_CODE_LENGTH = 6;
// Set a very long session duration (e.g., 1 year in seconds)
const SESSION_EXPIRY = 60 * 60 * 24 * 365;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Helper function to generate verification code
  const generateVerificationCode = () => {
    return Math.floor(
      10 ** (VERIFICATION_CODE_LENGTH - 1) +
        Math.random() * 9 * 10 ** (VERIFICATION_CODE_LENGTH - 1)
    ).toString();
  };

  // Helper function to show toast messages
  const showToast = useCallback(
    (title, description, isError = false) => {
      toast({
        title,
        description,
        variant: isError ? "destructive" : "default",
      });
    },
    [toast]
  );

  // Helper function to handle errors
  const handleError = useCallback(
    (error, fallbackMessage) => {
      console.error(fallbackMessage, error);
      showToast(
        "Error",
        error instanceof Error ? error.message : fallbackMessage,
        true
      );
      throw error;
    },
    [showToast]
  );

  // Transform user data from Supabase to application format
  const transformUserData = useCallback((userData) => {
    if (!userData) return null;

    return {
      id: userData.id,
      name: userData.full_name,
      email: userData.email,
      role: userData.role,
      isVerified: userData.is_verified,
      doctorCode: userData.doctor_code,
      avatarUrl: userData.avatar_url,
      specialization: userData.specialization,
      createdAt: userData.created_at,
      lastLogin: userData.last_login,
    };
  }, []);

  // Session refresh function - periodically refreshes the session token
  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.warn("Session refresh failed:", error);
      } else {
        console.log("Session refreshed successfully");
      }
    } catch (error) {
      console.error("Error refreshing session:", error);
    }
  }, []);

  useEffect(() => {
    let subscription;
    let sessionRefreshInterval;

    const setupAuthListener = async () => {
      try {
        // Check current session on initial load
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session) {
          await fetchUserProfile(sessionData.session.user.id);

          // Set up session persistence by configuring long-lived sessions
          const { error: persistenceError } = await supabase.auth.updateUser({
            data: { persistent: true },
          });

          if (persistenceError) {
            console.warn(
              "Failed to configure session persistence:",
              persistenceError
            );
          }
        } else {
          setUser(null);
          setIsLoading(false);
        }

        // Set up auth state listener for subsequent changes
        const { data } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("Auth event:", event);

            if (session) {
              // Keep session alive by refreshing before expiration
              if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
                // Configure the session to be long-lived
                await supabase.auth.updateUser({
                  data: { persistent: true },
                });
              }

              await fetchUserProfile(session.user.id);
            } else {
              setUser(null);
              setIsLoading(false);
            }
          }
        );

        subscription = data.subscription;

        // Set up a periodic refresh to keep the session alive
        // Refresh session every 12 hours to ensure it never expires
        sessionRefreshInterval = setInterval(
          refreshSession,
          1000 * 60 * 60 * 12
        );
      } catch (error) {
        console.error("Auth listener setup error:", error);
        setUser(null);
        setIsLoading(false);
      }
    };

    const fetchUserProfile = async (userId) => {
      try {
        const { data: userData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        } else {
          setUser(transformUserData(userData));
        }
      } catch (error) {
        console.error("Unexpected error fetching profile:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    setupAuthListener();

    return () => {
      if (subscription) subscription.unsubscribe();
      if (sessionRefreshInterval) clearInterval(sessionRefreshInterval);
    };
  }, [transformUserData, refreshSession]);

  const login = async (email, password) => {
    try {
      // Set a very long session when logging in
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          // Configure session to persist until explicitly logged out
          expiresIn: SESSION_EXPIRY,
        },
      });

      if (error) throw error;

      // Additional step to mark session as persistent
      await supabase.auth.updateUser({
        data: { persistent: true },
      });

      showToast("Welcome back!", "You have successfully signed in.");
    } catch (error) {
      handleError(error, "Invalid email or password. Please try again.");
    }
  };

  const logout = async () => {
    try {
      // Clear any session refresh intervals
      clearInterval(refreshSession);

      // Sign out from all devices
      const { error } = await supabase.auth.signOut({ scope: "global" });
      if (error) throw error;

      setUser(null);
      showToast("Signed out", "You have been successfully signed out.");
    } catch (error) {
      handleError(error, "Failed to sign out. Please try again.");
    }
  };

  const requestVerificationCode = async (licenseNumber) => {
    try {
      if (!user || user.role !== "doctor") {
        throw new Error("Only doctors can request verification");
      }

      const verificationCode = generateVerificationCode();
      const codeExpiry = new Date();
      codeExpiry.setHours(
        codeExpiry.getHours() + VERIFICATION_CODE_EXPIRY_HOURS
      );

      // Check if a record exists first
      const { data: existingRecord, error: checkError } = await supabase
        .from("doctor_verifications")
        .select("id")
        .eq("doctor_id", user.id)
        .eq("license_number", licenseNumber)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 = not found
        throw checkError;
      }

      // If record exists, update it. Otherwise, insert a new one.
      const operation = existingRecord ? "update" : "insert";

      const verificationData = {
        verification_code: verificationCode,
        code_expiry: codeExpiry.toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (operation === "insert") {
        verificationData.doctor_id = user.id;
        verificationData.license_number = licenseNumber;
        verificationData.created_at = new Date().toISOString();
      }

      const { error } =
        operation === "update"
          ? await supabase
              .from("doctor_verifications")
              .update(verificationData)
              .eq("id", existingRecord.id)
          : await supabase
              .from("doctor_verifications")
              .insert(verificationData);

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
        throw new Error("Failed to send verification email. Please try again.");
      }

      showToast(
        "Verification Code Sent",
        "A verification code has been sent to your email address. Please check your inbox."
      );
    } catch (error) {
      handleError(
        error,
        "Failed to generate verification code. Please try again."
      );
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

      // Use a transaction for updating both tables
      const { error: transactionError } = await supabase.rpc("verify_doctor", {
        doctor_id_param: user.id,
        verification_id_param: data.id,
      });

      if (transactionError) throw transactionError;

      setUser((prev) => (prev ? { ...prev, isVerified: true } : null));

      showToast(
        "Verification Successful",
        "Your doctor account has been verified. You can now access the doctor dashboard."
      );
    } catch (error) {
      handleError(error, "Verification failed. Please try again.");
    }
  };

  const verifyDoctorCode = async (code) => {
    try {
      if (!user || user.role !== "doctor") {
        throw new Error("Only doctors can verify codes");
      }

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

      showToast(
        "Verification Successful",
        "Your doctor account has been verified."
      );
    } catch (error) {
      handleError(error, "Please check your code and try again.");
    }
  };

  const resetDoctorCode = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;

      showToast(
        "Reset Code Sent",
        "Check your email for instructions to reset your doctor code."
      );
    } catch (error) {
      handleError(
        error,
        "Unable to reset your doctor code. Please try again later."
      );
    }
  };

  const updateUserProfile = async (updates) => {
    try {
      if (!user) {
        throw new Error("You must be logged in to update your profile");
      }

      const profileUpdates = {};

      // Map client-side property names to database column names
      const fieldMappings = {
        name: "full_name",
        email: "email",
        avatarUrl: "avatar_url",
        specialization: "specialization",
      };

      // Build updates object with proper database field names
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && fieldMappings[key]) {
          // Only include doctor-specific fields if user is a doctor
          if (key === "specialization" && user.role !== "doctor") return;
          profileUpdates[fieldMappings[key]] = value;
        }
      });

      // Don't proceed with empty updates
      if (Object.keys(profileUpdates).length === 0) {
        throw new Error("No valid profile updates provided");
      }

      const { error } = await supabase
        .from("profiles")
        .update(profileUpdates)
        .eq("id", user.id);

      if (error) throw error;

      // Update local user state with the changes
      const updatedUserData = {};
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          updatedUserData[key] = value;
        }
      });

      setUser((prev) => (prev ? { ...prev, ...updatedUserData } : null));

      showToast(
        "Profile Updated",
        "Your profile has been successfully updated."
      );
    } catch (error) {
      handleError(error, "Failed to update profile. Please try again.");
    }
  };

  const value = {
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
