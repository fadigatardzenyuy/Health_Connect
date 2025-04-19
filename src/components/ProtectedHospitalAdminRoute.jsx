import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function ProtectedHospitalAdminRoute({ children }) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to access this page.",
          variant: "destructive",
        });
        navigate("/signin");
      } else if (user.role !== "hospital_admin") {
        toast({
          title: "Access Denied",
          description:
            "You do not have permission to access hospital administration.",
          variant: "destructive",
        });
        navigate("/dashboard");
      }
    }
  }, [user, isLoading, navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-48 bg-slate-200 rounded mb-4"></div>
          <div className="h-4 w-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "hospital_admin") {
    return null;
  }

  return <>{children}</>;
}
