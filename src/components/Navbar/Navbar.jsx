import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DashboardSwitcher } from "../DashboardSwitcher";
import { ProfileMenu } from "./ProfileMenu";
import { MobileHeader } from "./MobileHeader";

export function Navbar({ userData }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileHeader userData={userData} />;
  }

  return (
    <div className="flex justify-between items-center h-16">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center">
          <h1 className="text-xl md:text-2xl font-bold text-primary">
            Cameroon Health Connect
          </h1>
        </Link>
        <DashboardSwitcher />
      </div>

      <div className="flex items-center space-x-4">
        <input
          type="search"
          placeholder="Search Health Connect"
          className="rounded-full bg-gray-100 px-4 py-2 w-64 hidden md:block"
        />
        <ProfileMenu userData={userData} />
      </div>
    </div>
  );
}
