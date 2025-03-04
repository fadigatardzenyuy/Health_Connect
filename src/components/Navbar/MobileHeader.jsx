import { Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function MobileHeader({ userData }) {
  return (
    <div className="flex justify-between items-center h-16">
      <Avatar>
        {userData.avatarUrl ? (
          <AvatarImage src={userData.avatarUrl} alt={userData.name} />
        ) : null}
        <AvatarFallback>{userData.initials}</AvatarFallback>
      </Avatar>
      <Link to="/dashboard" className="flex items-center">
        <h1 className="text-lg font-bold text-primary">WAHPITA</h1>
      </Link>
      <Button variant="ghost" size="icon" asChild>
        <Link to="/settings">
          <Settings className="h-5 w-5 text-gray-600" />
        </Link>
      </Button>
    </div>
  );
}
