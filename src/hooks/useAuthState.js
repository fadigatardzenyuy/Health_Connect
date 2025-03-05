import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export function useAuthState() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        // Initial session check
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

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log(`Auth state changed: ${event}`, session);

                if (session) {
                    fetchUserData(session.user.id);
                } else {
                    setUser(null);
                    setIsLoading(false);
                }
            }
        );

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
                email: userData.email,
                role: userData.role,
                isVerified: userData.is_verified,
                doctorCode: userData.doctor_code,
                avatarUrl: userData.avatar_url,
                specialization: userData.specialization,
            });
        } catch (error) {
            console.error("Error in fetchUserData:", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        user,
        setUser,
        isLoading,
        refreshUserData: (userId) => fetchUserData(userId),
    };
}