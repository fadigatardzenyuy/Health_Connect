import React from "react";
import { Link } from "react-router-dom";
import { Menu, Bell, MessageCircle } from "lucide-react";
import { doctor4 } from "../Assets/images"; // Fallback image
import {
  SignedIn,
  SignedOut,
  SignOutButton,
  useUser,
} from "@clerk/clerk-react"; // Import useUser hook

const Navbar = () => {
  const { user } = useUser(); // Fetch user data

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button className="text-gray-500 focus:outline-none focus:text-gray-600 md:hidden">
              <Menu size={24} />
            </button>
            <Link
              to="/"
              className="text-xl font-semibold text-blue-600 ml-4 md:ml-0"
            >
              Cameroon Health Connect
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search Health Connect"
              className="bg-gray-100 rounded-full py-2 px-4 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Link
              to="/notifications"
              className="text-gray-600 hover:text-blue-500"
            >
              <Bell size={24} />
            </Link>
            <Link to="/messages" className="text-gray-600 hover:text-blue-500">
              <MessageCircle size={24} />
            </Link>
            <SignedIn>
              <Link to="/profile">
                <img
                  className="h-8 w-8 rounded-full"
                  src={user?.profileImageUrl || doctor4} // Use the profile image or fallback
                  alt="Profile"
                />
              </Link>
              <SignOutButton className="text-gray-600 hover:text-red-500">
                Sign Out
              </SignOutButton>
            </SignedIn>
            <SignedOut>
              <Link to="/signin" className="text-gray-600 hover:text-blue-500">
                Sign In
              </Link>
              <Link to="/signup" className="text-gray-600 hover:text-blue-500">
                Sign Up
              </Link>
            </SignedOut>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
