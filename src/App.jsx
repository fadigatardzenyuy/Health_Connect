import React from "react";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import Navbar from "./components/Navbar";
import BottomNavigation from "./components/BottomNavigation";
import Dashboard from "./pages/Dashboard";
import AppointmentForm from "./pages/Appointment";
import UserProfile from "./pages/UserProfile";
import ProfileEdit from "./pages/ProfileEdit";
import AdminDashboard from "./pages/AdminDashboard";
import MedicalReportPurchase from "./components/MedicalReport";
import Onboarding from "./pages/Onboarding";
import SignInPage from "./components/Login"; // Ensure this is your SignIn component
import SignUpPage from "./components/SignUp"; // Ensure this is your SignUp component
import ProtectedRoute from "./components/ProtecteRoute"; // Import your ProtectedRoute component

// Layout component for shared UI
const Layout = () => (
  <div className="min-h-screen bg-gray-100 flex flex-col">
    <Navbar />
    <main className="flex-grow container mx-auto px-4 py-8">
      <Outlet />
    </main>
    <BottomNavigation />
  </div>
);

// Define your routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      { path: "/book-appointment", element: <AppointmentForm /> },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/edit-profile",
        element: (
          <ProtectedRoute>
            <ProfileEdit />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin-dashboard",
        element: (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/medical-reports",
        element: (
          <ProtectedRoute>
            <MedicalReportPurchase />
          </ProtectedRoute>
        ),
      },
      // Add additional routes as needed
    ],
  },
  { path: "/onboarding", element: <Onboarding /> },
  { path: "/signup", element: <SignUpPage /> },
  { path: "/signin", element: <SignInPage /> },
]);

const App = () => {
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  return (
    // <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <div className="App">
      <RouterProvider router={router} />
    </div>
    // </ClerkProvider>
  );
};

export default App;
