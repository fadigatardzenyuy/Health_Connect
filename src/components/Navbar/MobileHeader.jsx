import { Menu, Phone, Search, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function MobileHeader({ userData }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="border-b border-gray-100">
      {/* Emergency contact bar
      <div className="bg-healthcare-gray py-1 px-4 text-xs flex justify-between items-center">
        <div className="flex items-center">
          <Phone className="h-3 w-3 mr-1" />
          <span>Emergency: +237 654 321 098</span>
        </div>
        <Link to="/settings" className="text-primary">
          <Settings className="h-4 w-4" />
        </Link>
      </div> */}
      {/* Main header */}
      <div className="flex justify-between items-center h-16 px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMenuOpen(!menuOpen)}
          className="relative z-20"
        >
          <Menu className="h-5 w-5 text-primary" />
        </Button>

        <Link to="/" className="flex items-center">
          <h1 className="text-lg font-bold">
            <span className="text-primary">Shisong</span>
            <span className="text-secondary font-normal">Connect</span>
          </h1>
        </Link>

        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs bg-primary text-white">
            {userData.initials}
          </AvatarFallback>
        </Avatar>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-10 bg-white overflow-y-auto">
          <div className="pt-16 px-6 pb-20">
            <div className="border-b pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  className="w-full py-2 pl-10 pr-4 rounded-full border border-gray-200"
                  placeholder="Search Health Connect"
                />
              </div>
            </div>

            <nav className="py-4">
              <ul className="space-y-4">
                <li>
                  <Link
                    to="/dashboard"
                    className="block py-2 text-primary font-medium"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/consultation-booking"
                    className="block py-2 text-gray-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    Find Hospital
                  </Link>
                </li>
                <li>
                  <Link
                    to="/medical-history"
                    className="block py-2 text-gray-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    Medical History
                  </Link>
                </li>
                <li>
                  <Link
                    to="/messages"
                    className="block py-2 text-gray-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    Messages
                  </Link>
                </li>
                <li>
                  <Link
                    to="/notifications"
                    className="block py-2 text-gray-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    Notifications
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile"
                    className="block py-2 text-gray-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </li>
                <li className="border-t pt-2 mt-4">
                  <Link
                    to="/settings"
                    className="block py-2 text-gray-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    Settings
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="mt-6">
              <Button className="w-full" onClick={() => setMenuOpen(false)}>
                Book Appointment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
