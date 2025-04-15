import { Link } from "react-router-dom";
import { ChevronDown, Phone, Menu, Search, Globe } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DashboardSwitcher } from "../DashboardSwitcher";
import { ProfileMenu } from "./ProfileMenu";
import { MobileHeader } from "./MobileHeader";
import { Button } from "../ui/button";

export function Navbar({ userData }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileHeader userData={userData} />;
  }

  return (
    <div className="border-b border-gray-100">
      {/* Top bar with contact info and language selector */}
      {/* <div className="bg-healthcare-gray py-1 px-4 text-xs text-gray-600">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Phone className="h-3 w-3 mr-1" />
              <span>Emergency: +237 654 321 098</span>
            </div>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">Bamenda Regional Hospital</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Globe className="h-3 w-3 mr-1" />
              <select className="text-xs bg-transparent border-none outline-none">
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </div>
            <a href="#" className="text-primary hover:underline">
              Patient Portal
            </a>
          </div>
        </div>
      </div> */}

      {/* Main navbar */}
      <div className="container mx-auto py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link to="/Dashboard" className="flex items-center">
              <h1 className="text-xl md:text-2xl font-bold text-primary">
                <span className="text-primary">SHISONG</span>
                <span className="text-secondary font-normal">Connect</span>
              </h1>
            </Link>

            <nav className="hidden lg:block">
              <ul className="flex space-x-8">
                <li className="group">
                  <a
                    href="/consultation-booking"
                    className="flex items-center text-gray-700 hover:text-primary"
                  >
                    Find a Hospital
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </a>
                  <div className="invisible group-hover:visible absolute bg-white shadow-lg rounded-md p-4 mt-2 border border-gray-100 w-56 z-10">
                    <div className="space-y-2">
                      <a
                        href="/consultation-booking"
                        className="block hover:text-primary"
                      >
                        All Hospitals
                      </a>
                      <a
                        href="/consultation-booking?type=regional"
                        className="block hover:text-primary"
                      >
                        Regional Hospitals
                      </a>
                      <a
                        href="/consultation-booking?type=district"
                        className="block hover:text-primary"
                      >
                        District Hospitals
                      </a>
                      <a
                        href="/consultation-booking?type=private"
                        className="block hover:text-primary"
                      >
                        Private Clinics
                      </a>
                    </div>
                  </div>
                </li>
                <li className="group">
                  <a
                    href="/medical-history"
                    className="flex items-center text-gray-700 hover:text-primary"
                  >
                    Medical Services
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center relative">
              <input
                type="search"
                placeholder="Search"
                className="pl-10 pr-4 py-2 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-primary w-48 lg:w-64"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
            </div>

            <Button
              variant="default"
              size="sm"
              className="hidden sm:inline-flex"
            >
              Book Appointment
            </Button>

            <ProfileMenu userData={userData} />
          </div>
        </div>
      </div>
    </div>
  );
}
