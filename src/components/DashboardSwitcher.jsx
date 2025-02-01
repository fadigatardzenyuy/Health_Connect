import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Stethoscope, Home } from "lucide-react";

export function DashboardSwitcher() {
  const navigate = useNavigate();
  const { isDoctor } = useAuth();

  if (!isDoctor) return null;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => navigate("/dashboard")}
      >
        <Home className="w-4 h-4" />
        <span className="hidden md:inline">Patient View</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => navigate("/doctor-dashboard")}
      >
        <Stethoscope className="w-4 h-4" />
        <span className="hidden md:inline">Doctor Dashboard</span>
      </Button>
    </div>
  );
}
