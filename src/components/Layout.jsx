import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { MobileNav } from "./MobileNav";
import { Navbar } from "./Navbar/Navbar";

export function Layout({ children }) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    initials: "",
    avatarUrl: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, email, avatar_url")
          .eq("id", user.id)
          .single();

        if (profile) {
          const initials =
            profile.full_name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2) || "";

          setUserData({
            name: profile.full_name || "",
            email: profile.email || "",
            initials,
            avatarUrl: profile.avatar_url || "",
          });
        }
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-[2000px] mx-auto px-4">
          {!isMobile && (
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
                  <Link
                    to="/profile"
                    className="text-lg font-medium hover:text-primary"
                  >
                    My Profile
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          )}
          <Navbar userData={userData} />
        </div>
      </header>

      <main className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-6">{children}</div>
      </main>

      <MobileNav />
    </div>
  );
}
