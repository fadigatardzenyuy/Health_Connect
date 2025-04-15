import { useState } from "react";
import { AdminNavbar } from "./AdminNavbar";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const AdminLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors">
      <AdminNavbar />

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Breadcrumb - visible on mobile only */}
        <div className="lg:hidden py-2 px-4 bg-white dark:bg-gray-900 border-b">
          <div className="flex items-center gap-2 text-sm">
            <Link
              to="/dashboard"
              className="flex items-center text-gray-500 hover:text-primary"
            >
              <Home className="h-3.5 w-3.5 mr-1" />
              <span>Home</span>
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-primary font-medium">Admin</span>
          </div>
        </div>

        <main className="flex-1 px-4 py-6 md:px-6 lg:py-8">
          <div className="max-w-[2000px] mx-auto">{children}</div>
        </main>
      </div>

      <footer className="bg-white dark:bg-gray-900 border-t py-6 transition-colors">
        <div className="max-w-[2000px] mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-medium mb-2 text-gray-900 dark:text-white">
                Hospital Admin Portal
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Manage your hospital operations efficiently
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-gray-900 dark:text-white">
                Support
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                admin-support@healthconnectbamenda.cm
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                +237 654 789 123
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-gray-900 dark:text-white">
                Quick Links
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/hospital-admin/settings"
                  className="text-primary hover:underline"
                >
                  Settings
                </Link>
                <Link
                  to="/hospital-admin/help"
                  className="text-primary hover:underline"
                >
                  Help
                </Link>
                <Link
                  to="/hospital-admin/analytics"
                  className="text-primary hover:underline"
                >
                  Analytics
                </Link>
                <Link
                  to="/hospital-admin/staff"
                  className="text-primary hover:underline"
                >
                  Staff
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t text-gray-500 dark:text-gray-400 text-sm text-center">
            &copy; {currentYear} Health Connect Bamenda - Hospital
            Administration Portal
          </div>
        </div>
      </footer>
    </div>
  );
};
