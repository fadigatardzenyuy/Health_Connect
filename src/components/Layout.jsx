import { Bell, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">
                Cameroon Health Connect
              </h1>
            </Link>
            <div className="flex items-center space-x-4">
              <input
                type="search"
                placeholder="Search Health Connect"
                className="rounded-full bg-gray-100 px-4 py-2 w-64"
              />
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Bell className="w-6 h-6 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <MessageCircle className="w-6 h-6 text-gray-600" />
              </button>
              <img
                src="https://ui-avatars.com/api/?name=User"
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-6">{children}</div>
      </main>
    </div>
  );
}
