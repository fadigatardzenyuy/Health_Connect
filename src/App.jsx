import React from "react";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import Navbar from "./components/Navbar";
import BottomNavigation from "./components/BottomNavigation";
import ProtectedRoute from "./components/ProtecteRoute"; // Fixed typo in import
import Layout from "./components/Layout";

// Patient Components
import Dashboard from "./pages/patient/Dashboard";
import AppointmentForm from "./pages/patient/Appointment";
import ProfileEdit from "./pages/patient/ProfileEdit";
import MedicalReportPurchase from "./components/MedicalReport";
import UserProfile from "./pages/patient/UserProfile";
import Onboarding from "./pages/patient/Onboarding";

// Admin Components
import AdminDashboard from "./pages/admin/AdminDashboard";
import Appointments from "./pages/admin/AppointmentsDoct";
import VideoConsultations from "./pages/admin/VideoConsultation";
import MedicalRecords from "./pages/admin/MedicalRecords";
import PatientList from "./pages/admin/PatientList";
import Settings from "./pages/admin/Settings";
import SignUpPage from "./components/SignUp";
import SignInPage from "./components/Login";

// Layout component for users
const UserLayout = () => (
  <div className="min-h-screen bg-gray-100 flex flex-col">
    <Navbar />
    <main className="flex-grow container mx-auto px-4 py-8">
      <Outlet />
    </main>
    <BottomNavigation />
  </div>
);

// Layout component for admin
const AdminLayout = () => (
  <div className="min-h-screen bg-gray-100 flex flex-col">
    <Layout />
    <main className="flex-grow container mx-auto px-4 py-8">
      <Outlet />
    </main>
  </div>
);

// Define your routes
const router = createBrowserRouter([
  {
    path: "/user",
    element: <UserLayout />,
    children: [
      {
        path: "",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      { path: "book-appointment", element: <AppointmentForm /> },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "edit-profile",
        element: (
          <ProtectedRoute>
            <ProfileEdit />
          </ProtectedRoute>
        ),
      },
      {
        path: "medical-reports",
        element: (
          <ProtectedRoute>
            <MedicalReportPurchase />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "appointments",
        element: <Appointments />,
      },
      {
        path: "video-consultations",
        element: <VideoConsultations />,
      },
      { path: "medical-records", element: <MedicalRecords /> },
      {
        path: "patients",
        element: <PatientList />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "/onboarding",
    element: <Onboarding />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path: "/signin",
    element: <SignInPage />,
  },
]);

const App = () => {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
