import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./index.css";
import { ProtectedHospitalAdminRoute } from "./components/ProtectedHospitalAdminRoute";
import Onboarding from "./pages/Onboarding";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import MedicalHistory from "./pages/MedicalHistory";
import ConsultationBookingPage from "./pages/ConsultationBooking";
import Messages from "./pages/Messages";
import AppointmentDetails from "./pages/AppointmentDetails";
import EPrescriptionsPage from "./pages/EPrescriptions";
import VideoConsultation from "./pages/VideoConsultation";
import AudioConsultation from "./pages/AudioConsultation";
import UserProfile from "./pages/UserProfile";
import Settings from "./pages/Settings";
import NotificationPage from "./pages/Notification";
import AiChatPage from "./pages/AiChatPage";
import SearchPage from "./pages/SearchPage";
import HospitalDetail from "./pages/HospitalDetail";
import HospitalAdminDashboard from "./pages/HospitalAdminDashboard";
import DepartmentOccupancy from "./pages/hospital-admin/DepartmentOccupancy";
import AppointmentsManagement from "./pages/hospital-admin/AppoitmentsManagement";
import StaffManagement from "./pages/hospital-admin/StaffManagement";
import ResourceScheduling from "./pages/hospital-admin/ResourcesScheduling";
import PatientFlow from "./pages/hospital-admin/PatientFlow";
import FinancialManagement from "./pages/hospital-admin/FinancialManagement";
import AnalyticsDashboard from "./pages/hospital-admin/AnalyticsDashboard";
import MessagesCenter from "./pages/hospital-admin/MessagesCenter";
import HospitalSettings from "./pages/hospital-admin/HospitalSetting";

const queryClient = new QueryClient();

const routes = [
  // Public Routes
  {
    path: "/",
    element: <Onboarding />,
  },

  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },

  // Patient Dashboard and Features
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/medical-history",
    element: <MedicalHistory />,
  },
  {
    path: "/consultation-booking",
    element: <ConsultationBookingPage />,
  },
  {
    path: "/messages",
    element: <Messages />,
  },
  {
    path: "/appointment-details/:id",
    element: <AppointmentDetails />,
  },
  {
    path: "/eprescriptions",
    element: <EPrescriptionsPage />,
  },
  {
    path: "/video-consultation/:appointmentId?",
    element: <VideoConsultation />,
  },
  {
    path: "/audio-consultation/:appointmentId?",
    element: <AudioConsultation />,
  },
  {
    path: "/profile",
    element: <UserProfile />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/notifications",
    element: <NotificationPage />,
  },
  {
    path: "/aiDoc",
    element: <AiChatPage />,
  },
  {
    path: "/search",
    element: <SearchPage />,
  },

  // Hospital Details Public View
  {
    path: "/hospital/:hospitalId",
    element: <HospitalDetail />,
  },

  // Hospital Admin Routes

  {
    path: "/hospital-admin",
    element: (
      <ProtectedHospitalAdminRoute>
        <HospitalAdminDashboard />
      </ProtectedHospitalAdminRoute>
    ),
  },
  {
    path: "/hospital-admin/departments",
    element: (
      <ProtectedHospitalAdminRoute>
        <DepartmentOccupancy />
      </ProtectedHospitalAdminRoute>
    ),
  },
  {
    path: "/hospital-admin/appointments",
    element: (
      <ProtectedHospitalAdminRoute>
        <AppointmentsManagement />
      </ProtectedHospitalAdminRoute>
    ),
  },
  {
    path: "/hospital-admin/staff",
    element: (
      <ProtectedHospitalAdminRoute>
        <StaffManagement />
      </ProtectedHospitalAdminRoute>
    ),
  },
  {
    path: "/hospital-admin/occupancy",
    element: (
      <ProtectedHospitalAdminRoute>
        <DepartmentOccupancy />
      </ProtectedHospitalAdminRoute>
    ),
  },
  {
    path: "/hospital-admin/scheduling",
    element: (
      <ProtectedHospitalAdminRoute>
        <ResourceScheduling />
      </ProtectedHospitalAdminRoute>
    ),
  },
  {
    path: "/hospital-admin/patient-flow",
    element: (
      <ProtectedHospitalAdminRoute>
        <PatientFlow />
      </ProtectedHospitalAdminRoute>
    ),
  },
  {
    path: "/hospital-admin/financial",
    element: (
      <ProtectedHospitalAdminRoute>
        <FinancialManagement />
      </ProtectedHospitalAdminRoute>
    ),
  },
  {
    path: "/hospital-admin/analytics",
    element: (
      <ProtectedHospitalAdminRoute>
        <AnalyticsDashboard />
      </ProtectedHospitalAdminRoute>
    ),
  },
  {
    path: "/hospital-admin/messages",
    element: (
      <ProtectedHospitalAdminRoute>
        <MessagesCenter />
      </ProtectedHospitalAdminRoute>
    ),
  },
  {
    path: "/hospital-admin/settings",
    element: (
      <ProtectedHospitalAdminRoute>
        <HospitalSettings />
      </ProtectedHospitalAdminRoute>
    ),
  },

  // Fallback Route
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];

const router = createBrowserRouter(routes);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Analytics />
        <SpeedInsights />
        <RouterProvider router={router} />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
