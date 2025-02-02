import { Settings, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNav } from "./MobileNav";
import { DashboardSwitcher } from "./DashboardSwitcher";
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
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-[2000px] mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {isMobile ? (
              <>
                <img
                  src={userData.avatar}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <Link to="/" className="flex items-center">
                  <h1 className="text-lg font-bold text-primary">
                    Health Connect
                  </h1>
                </Link>
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/settings">
                    <Settings className="h-5 w-5 text-gray-600" />
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden">
                      <User className="h-6 w-6" />
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
                        to="/medical-history"
                        className="text-lg font-medium hover:text-primary"
                      >
                        Medical History
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
                      <Dialog
                        open={isEditingProfile}
                        onOpenChange={setIsEditingProfile}
                      >
                        <DialogTrigger asChild>
                          <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            <span>Edit Profile</span>
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Profile</DialogTitle>
                          </DialogHeader>
                          <form
                            onSubmit={handleProfileUpdate}
                            className="space-y-4"
                          >
                            <div className="space-y-2">
                              <label
                                htmlFor="name"
                                className="text-sm font-medium"
                              >
                                Name
                              </label>
                              <Input
                                id="name"
                                name="name"
                                defaultValue={userData.name}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="email"
                                className="text-sm font-medium"
                              >
                                Email
                              </label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                defaultValue={userData.email}
                                required
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditingProfile(false)}
                              >
                                Cancel
                              </Button>
                              <Button type="submit">Save Changes</Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <DropdownMenuItem asChild>
                        <Link to="/settings">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-6">{children}</div>
      </main>

      <MobileNav />
    </div>
  );
}
