import { Home, MessageSquare, Search, Bell, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function MobileNav() {
  const location = useLocation();

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
          to="/messages"
          className={`flex flex-col items-center ${
            isActive("/messages") ? "text-primary" : "text-gray-500"
          }`}
        >
          <MessageSquare className="h-6 w-6" />
          <span className="text-xs mt-1">Messages</span>
        </Link>
        <Link
          to="/search"
          className={`flex flex-col items-center ${
            isActive("/search") ? "text-primary" : "text-gray-500"
          }`}
        >
          <Search className="h-6 w-6" />
          <span className="text-xs mt-1">Search</span>
        </Link>
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
