import {
  Home,
  MessageSquare,
  Search,
  Bell,
  User,
  Calendar,
  Building,
  Hospital,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function MobileNav() {
  const location = useLocation();
  const { user } = useAuth();
  const isHospitalAdmin = user?.role === "hospital_admin";

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-50">
      <div className="flex items-center justify-around p-3">
        <Link
          to="/dashboard"
          className={`flex flex-col items-center ${
            isActive("/dashboard") ? "text-primary" : "text-gray-500"
          }`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link
          to="/consultation-booking"
          className={`flex flex-col items-center ${
            isActive("/consultation-booking") ? "text-primary" : "text-gray-500"
          }`}
        >
          <Search className="h-6 w-6" />
          <span className="text-xs mt-1">Hospitals</span>
        </Link>
        {isHospitalAdmin ? (
          <Link
            to="/hospital-admin"
            className={`flex flex-col items-center ${
              isActive("/hospital-admin") ? "text-primary" : "text-gray-500"
            }`}
          >
            <Hospital className="h-6 w-6" />
            <span className="text-xs mt-1">Admin</span>
          </Link>
        ) : (
          <Link
            to="/messages"
            className={`flex flex-col items-center ${
              isActive("/messages") ? "text-primary" : "text-gray-500"
            }`}
          >
            <MessageSquare className="h-6 w-6" />
            <span className="text-xs mt-1">Messages</span>
          </Link>
        )}
        <Link
          to="/notifications"
          className={`flex flex-col items-center ${
            isActive("/notifications") ? "text-primary" : "text-gray-500"
          }`}
        >
          <Bell className="h-6 w-6" />
          <span className="text-xs mt-1">Alerts</span>
        </Link>
        <Link
          to="/profile"
          className={`flex flex-col items-center ${
            isActive("/profile") ? "text-primary" : "text-gray-500"
          }`}
        >
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  );
}
