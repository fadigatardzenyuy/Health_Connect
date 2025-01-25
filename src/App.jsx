import React from "react";
import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import Navbar from "./components/Navbar";
import BottomNavigation from "./components/BottomNavigation";
import Onboarding from "./pages/patient/Onboarding";

// Patient Components
import Dashboard from "./pages/patient/Dashboard";
import AppointmentForm from "./pages/patient/Appointment";
import ProfileEdit from "./pages/patient/ProfileEdit";
import MedicalReportPurchase from "./components/MedicalReport";
import UserProfile from "./pages/patient/UserProfile";
import ChatPage from "./pages/patient/ChatBot";

// Admin Components
import AdminDashboard from "./pages/admin/AdminDashboard";
import Appointments from "./pages/admin/AppointmentsDoct";
import VideoConsultations from "./pages/admin/VideoConsultation";
import MedicalRecords from "./pages/admin/MedicalRecords";
import PatientList from "./pages/admin/PatientList";
import Settings from "./pages/admin/Settings";
import SignUpPage from "./components/SignUp";
import SignInPage from "./components/Login";
import Layout from "./components/Layout";

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

// Route Protection Wrappers
const ProtectedRoute = ({ children }) => (
  <>
    <SignedIn>{children}</SignedIn>
    <SignedOut>
      <Navigate to="/signin" replace />
    </SignedOut>
  </>
);

// Define your routes
const router = createBrowserRouter([
  {
    path: "/",
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
  {
    path: "/user",
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "book-appointment",
        element: (
          <ProtectedRoute>
            <AppointmentForm />
          </ProtectedRoute>
        ),
      },
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
      {
        path: "chat",
        element: (
          <ProtectedRoute>
            <ChatPage />
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
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "appointments",
        element: (
          <ProtectedRoute>
            <Appointments />
          </ProtectedRoute>
        ),
      },
      {
        path: "video-consultations",
        element: (
          <ProtectedRoute>
            <VideoConsultations />
          </ProtectedRoute>
        ),
      },
      {
        path: "medical-records",
        element: (
          <ProtectedRoute>
            <MedicalRecords />
          </ProtectedRoute>
        ),
      },
      {
        path: "patients",
        element: (
          <ProtectedRoute>
            <PatientList />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
