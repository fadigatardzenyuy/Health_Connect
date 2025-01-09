import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, MessageCircle, Bell, User } from "lucide-react";

const BottomNavigation = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 md:hidden z-10">
      <Link
        to="/"
        className={`flex flex-col items-center justify-center w-full h-full ${
          isActive("/") ? "text-blue-500" : "text-gray-500"
        }`}
      >
        <Home size={24} />
        <span className="text-xs mt-1">Home</span>
      </Link>
      <Link
        to="/search"
        className={`flex flex-col items-center justify-center w-full h-full ${
          isActive("/search") ? "text-blue-500" : "text-gray-500"
        }`}
      >
        <Search size={24} />
        <span className="text-xs mt-1">Search</span>
      </Link>
      <Link
        to="/messages"
        className={`flex flex-col items-center justify-center w-full h-full ${
          isActive("/messages") ? "text-primary" : "text-gray-500"
        }`}
      >
        <MessageCircle size={24} />
        <span className="text-xs mt-1">Messages</span>
      </Link>
      <Link
        to="/notifications"
        className={`flex flex-col items-center justify-center w-full h-full ${
          isActive("/notifications") ? "text-blue-500" : "text-gray-500"
        }`}
      >
        <Bell size={24} />
        <span className="text-xs mt-1">Alerts</span>
      </Link>
      <Link
        to="/profile"
        className={`flex flex-col items-center justify-center w-full h-full ${
          isActive("/profile") ? "text-blue-500" : "text-gray-500"
        }`}
      >
        <User size={24} />
        <span className="text-xs mt-1">Profile</span>
      </Link>
    </nav>
  );
};

export default BottomNavigation;
