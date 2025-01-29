import {
  Bell,
  MessageCircle,
  Menu,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export function Layout({ children }) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const { toast } = useToast();

  // Mock user data - in a real app, this would come from your auth system
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://ui-avatars.com/api/?name=John+Doe",
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newName = formData.get("name");
    const newEmail = formData.get("email");

    setUserData({
      ...userData,
      name: newName,
      email: newEmail,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newName)}`,
    });

    setIsEditingProfile(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {isMobile && (
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col gap-4 mt-8">
                    <Link
                      to="/dashboard"
                      className="text-lg font-medium hover:text-primary"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/messages"
                      className="text-lg font-medium hover:text-primary"
                    >
                      Messages
                    </Link>
                    <Link
                      to="/consultation-booking"
                      className="text-lg font-medium hover:text-primary"
                    >
                      Book Consultation
                    </Link>
                    <Link
                      to="/doctor-dashboard"
                      className="text-lg font-medium hover:text-primary"
                    >
                      Doctor Dashboard
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            )}

            <Link to="/" className="flex items-center">
              <h1 className="text-xl md:text-2xl font-bold text-primary">
                Health Connect
              </h1>
            </Link>

            <div className="flex items-center space-x-2 md:space-x-4">
              <input
                type="search"
                placeholder="Search Health Connect"
                className="rounded-full bg-gray-100 px-4 py-2 w-32 md:w-64 hidden md:block"
              />
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 md:h-6 md:w-6 text-gray-600" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
              <Link to="/messages">
                <Button variant="ghost" size="icon" className="relative">
                  <MessageCircle className="h-5 w-5 md:h-6 md:w-6 text-gray-600" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <img
                      src={userData.avatar}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to="/profile">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Edit Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem>
                    <Link to="/settings">
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Setting</span>
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <Link to="/signin">
                    <DropdownMenuItem className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-6">{children}</div>
      </main>
    </div>
  );
}
