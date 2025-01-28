import { Bell, MessageCircle, Menu, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-2 lg:hidden"
                  >
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[80vw] sm:w-[350px] lg:hidden"
                >
                  <nav className="flex flex-col gap-4 mt-8">
                    <Link
                      to="/dashboard"
                      className="text-lg font-medium hover:text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/messages"
                      className="text-lg font-medium hover:text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      Messages
                    </Link>
                    <Link
                      to="/consultation-booking"
                      className="text-lg font-medium hover:text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      Book Consultation
                    </Link>
                    <Link
                      to="/doctor-dashboard"
                      className="text-lg font-medium hover:text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      Doctor Dashboard
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
              <Link to="/" className="flex items-center">
                <h1 className="text-xl font-bold text-primary truncate">
                  Health Connect
                </h1>
              </Link>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative hidden sm:block">
                <Input
                  type="search"
                  placeholder="Search Health Connect"
                  className="w-full sm:w-[200px] lg:w-[300px]"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </Button>
              <Link to="/messages">
                <Button variant="ghost" size="icon" aria-label="Messages">
                  <MessageCircle className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="rounded-full p-0">
                <img
                  src="https://ui-avatars.com/api/?name=User"
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
