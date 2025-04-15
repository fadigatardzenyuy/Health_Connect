import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { User, Flag } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { MobileNav } from "./MobileNav";
import { Navbar } from "./Navbar/Navbar";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function Layout({ children }) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [showLanguageAlert, setShowLanguageAlert] = useState(true);

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

    // Check preferred language from localStorage
    const hasChosenLanguage = localStorage.getItem("preferredLanguage");
    if (hasChosenLanguage) {
      setShowLanguageAlert(false);
    }
  }, []);

  const handleSetLanguage = (language) => {
    localStorage.setItem("preferredLanguage", language);
    setShowLanguageAlert(false);
  };

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
              <SheetContent
                side="left"
                className="w-[300px] sm:w-[400px] overflow-y-auto"
              >
                <div className="flex items-center mt-6 mb-8">
                  <Flag className="h-5 w-5 mr-2 text-[#007a5e]" />
                  <div>
                    <h3 className="font-bold text-lg">Shisong Connect</h3>
                    <p className="text-xs text-gray-500">
                      Serving the North-West Region
                    </p>
                  </div>
                </div>
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
                    Find Hospital
                  </Link>
                  <Link
                    to="/medical-history"
                    className="text-lg font-medium hover:text-primary"
                  >
                    Medical History
                  </Link>
                  <Link
                    to="/profile"
                    className="text-lg font-medium hover:text-primary"
                  >
                    My Profile
                  </Link>
                </nav>

                <div className="absolute bottom-8 left-6 right-6">
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">
                      Emergency Contacts
                    </h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>Bamenda Regional Hospital: +237 654 123 456</li>
                      <li>Ambulance Service: +237 677 789 123</li>
                      <li>Health Connect Support: +237 678 456 789</li>
                    </ul>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
          <Navbar userData={userData} />
        </div>
      </header>

      <main className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showLanguageAlert && (
          <div className="mb-6">
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <span>
                  Choose your preferred language / Choisissez votre langue
                  préférée:
                </span>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSetLanguage("english")}
                  >
                    English
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSetLanguage("french")}
                  >
                    Français
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSetLanguage("pidgin")}
                  >
                    Pidgin
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="grid grid-cols-12 gap-6 pb-mobile-nav md:pb-0">
          {children}
        </div>
      </main>

      <MobileNav />

      <footer className="bg-white border-t py-6 mt-12 hidden md:block">
        <div className="max-w-[2000px] mx-auto px-4 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-center">
            <div>
              <h4 className="font-medium mb-2">Shisong Connect</h4>
              <p className="text-gray-500">
                Connecting patients to quality healthcare in Bamenda and the
                North-West Region
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Important Contacts</h4>
              <p className="text-gray-500">Emergency: +237 683 532 083</p>
              <p className="text-gray-500">Support: info@shisongconnect.cm</p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t text-gray-500 text-sm text-center">
            &copy; {new Date().getFullYear()} Shisong Connect. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
