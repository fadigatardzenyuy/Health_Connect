import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Building,
  ChevronDown,
  CreditCard,
  FileText,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  PieChart,
  Settings,
  User,
  Users,
  Activity,
  Calendar,
  LayoutDashboard,
  Stethoscope,
  LineChart,
  Shield,
  Search,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hospitalName, setHospitalName] = useState("");
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchHospitalDetails = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("hospital_name, hospital_id")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        if (data?.hospital_name) {
          setHospitalName(data.hospital_name);
        }
      } catch (error) {
        console.error("Error fetching hospital details:", error);
      }
    };

    fetchHospitalDetails();
  }, [user?.id]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });

      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const navItems = [
    {
      path: "/hospital-admin",
      label: "Dashboard",
      icon: LayoutDashboard,
      description: "Hospital overview",
    },
    {
      path: "/hospital-admin/departments",
      label: "Departments",
      icon: Building,
      description: "Manage hospital units",
    },
    {
      path: "/hospital-admin/staff",
      label: "Staff",
      icon: Stethoscope,
      description: "Personnel management",
    },
    {
      path: "/hospital-admin/appointments",
      label: "Appointments",
      icon: Calendar,
      description: "Schedule management",
      badge: "Active",
    },
    {
      path: "/hospital-admin/scheduling",
      label: "Scheduling",
      icon: FileText,
      description: "Staff shifts & rotations",
    },
    {
      path: "/hospital-admin/patient-flow",
      label: "Patient Flow",
      icon: Activity,
      description: "Patient journey tracking",
    },
    {
      path: "/hospital-admin/financial",
      label: "Financial",
      icon: CreditCard,
      description: "Billing & finances",
    },
    {
      path: "/hospital-admin/analytics",
      label: "Analytics",
      icon: LineChart,
      description: "Hospital performance data",
    },
    {
      path: "/hospital-admin/messages",
      label: "Communications",
      icon: MessageSquare,
      description: "Internal messaging",
      notifications: 5,
    },
    {
      path: "/hospital-admin/settings",
      label: "Settings",
      icon: Settings,
      description: "System configuration",
    },
  ];

  const NotificationsPanel = () => (
    <div className="p-4 max-h-[350px] overflow-y-auto">
      <div className="space-y-4">
        <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-md shadow-sm">
          <div className="flex justify-between items-start">
            <div className="font-medium text-amber-800">
              Staff Shortage Alert
            </div>
            <div className="text-xs text-gray-500">10m ago</div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            ER department reports critical staff shortage. 2 nurses needed for
            evening shift.
          </p>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-md shadow-sm">
          <div className="flex justify-between items-start">
            <div className="font-medium text-blue-800">System Update</div>
            <div className="text-xs text-gray-500">1h ago</div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Scheduled maintenance planned for the EMR system tonight at 2:00 AM.
          </p>
        </div>

        <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-md shadow-sm">
          <div className="flex justify-between items-start">
            <div className="font-medium text-green-800">Inventory Update</div>
            <div className="text-xs text-gray-500">3h ago</div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            New medical supplies have been delivered to the central storage.
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <Button variant="outline" size="sm" className="w-full">
          View All Notifications
        </Button>
      </div>
    </div>
  );

  return (
    <header className="bg-white border-b sticky top-0 z-50 text-gray-800 shadow-sm dark:bg-gray-950 dark:text-white transition-colors">
      <div className="max-w-[2000px] mx-auto">
        <div className="flex items-center justify-between py-3 px-4 md:px-6">
          {/* Logo and Title */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden mr-2 text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>

            <Link to="/hospital-admin" className="flex items-center group">
              <div className="p-2 bg-healthcare-blue rounded-md text-white mr-3">
                <Shield className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h1 className="font-semibold text-lg text-primary">
                  Admin Portal
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {hospitalName || "Hospital Dashboard"}
                </p>
              </div>
            </Link>
          </div>

          {/* Search bar - desktop only */}
          <div className="hidden md:flex items-center relative max-w-xs w-full mx-4">
            <Search className="h-4 w-4 absolute left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search hospital resources..."
              className="pl-9 pr-4 py-1.5 text-sm w-full rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-gray-50 dark:bg-gray-900 dark:border-gray-700"
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-gray-50 dark:bg-gray-900 backdrop-blur-sm rounded-full px-1.5 py-1">
            {navItems.slice(0, 6).map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={`rounded-full text-sm ${
                    isActive
                      ? "text-white"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  }`}
                  asChild
                >
                  <Link to={item.path} className="flex items-center gap-1.5">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                    {item.badge && (
                      <Badge variant="info" className="h-5 text-[10px] ml-1">
                        {item.badge}
                      </Badge>
                    )}
                    {item.notifications && (
                      <Badge
                        variant="urgent"
                        className="h-5 w-5 flex items-center justify-center rounded-full p-0 text-[10px]"
                      >
                        {item.notifications}
                      </Badge>
                    )}
                  </Link>
                </Button>
              );
            })}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  <span className="mr-1">More</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-1">
                {navItems.slice(6).map((item) => (
                  <DropdownMenuItem key={item.path} asChild className="py-2">
                    <Link to={item.path} className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.description}
                        </p>
                      </div>
                      {item.notifications && (
                        <Badge
                          variant="urgent"
                          className="h-5 w-5 flex items-center justify-center rounded-full p-0 text-[10px]"
                        >
                          {item.notifications}
                        </Badge>
                      )}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Avatar and Dropdown */}
          <div className="flex items-center space-x-3">
            {isMobile ? (
              <Drawer>
                <DrawerTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadNotifications > 0 && (
                      <Badge
                        variant="urgent"
                        className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-[10px]"
                      >
                        {unreadNotifications}
                      </Badge>
                    )}
                    <span className="sr-only">View notifications</span>
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader className="border-b pb-4">
                    <DrawerTitle>Notifications</DrawerTitle>
                    <DrawerDescription>
                      Stay updated with hospital activities
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="px-4 py-2">
                    <NotificationsPanel />
                  </div>
                  <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                      <Button variant="outline">Close</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
                    onClick={() => setUnreadNotifications(0)}
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadNotifications > 0 && (
                      <Badge
                        variant="urgent"
                        className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-[10px]"
                      >
                        {unreadNotifications}
                      </Badge>
                    )}
                    <span className="sr-only">View notifications</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Notifications</DialogTitle>
                    <DialogDescription>
                      Stay updated with hospital activities
                    </DialogDescription>
                  </DialogHeader>
                  <NotificationsPanel />
                </DialogContent>
              </Dialog>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 h-9 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-white"
                >
                  <Avatar className="h-8 w-8 border-2 border-gray-200 dark:border-gray-700">
                    <AvatarImage
                      src={user?.avatarUrl}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback className="bg-primary text-white">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium line-clamp-1">
                      {user?.name || "Admin User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Hospital Admin
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 md:ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-1">
                <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate("/profile")}
                  className="py-2"
                >
                  <User className="mr-2 h-4 w-4 text-primary" />
                  <div>
                    <span className="font-medium">Profile</span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Manage your account
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/hospital-admin/settings")}
                  className="py-2"
                >
                  <Settings className="mr-2 h-4 w-4 text-primary" />
                  <div>
                    <span className="font-medium">Settings</span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Configure hospital settings
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="py-2 text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <div>
                    <span className="font-medium">Sign out</span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Exit admin portal
                    </p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-800 dark:text-white shadow-lg rounded-b-lg">
            <div className="p-3 mb-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search hospital resources..."
                  className="pl-9 pr-4 py-2 text-sm w-full rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-gray-50 dark:bg-gray-900 dark:border-gray-700"
                />
              </div>
            </div>

            <div className="p-2 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <div key={item.path} className="mb-1">
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                      className={`w-full justify-start ${
                        isActive
                          ? "bg-primary text-white"
                          : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                      }`}
                      asChild
                    >
                      <Link to={item.path} className="flex items-center">
                        <item.icon className="h-4 w-4 mr-3" />
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between">
                            <span>{item.label}</span>
                            {item.notifications && (
                              <Badge
                                variant="urgent"
                                className="h-5 w-5 flex items-center justify-center rounded-full p-0 text-[10px]"
                              >
                                {item.notifications}
                              </Badge>
                            )}
                            {item.badge && (
                              <Badge variant="info" className="text-[10px]">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-800">
              <Button
                variant="outline"
                className="w-full justify-center"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
