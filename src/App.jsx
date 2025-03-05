import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import VideoConsultation from "./pages/VideoConsultation";
import AudioConsultation from "./pages/AudioConsultation";
import ConsultationBooking from "./pages/ConsultationBooking";
import DoctorDashboard from "./pages/DoctorDashboard";
import Messages from "./pages/Messages";
import Onboarding from "./pages/Onboarding";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import EPrescriptions from "./pages/EPrescriptions";
import UserProfile from "./pages/UserProfile";
import Settings from "./pages/Settings";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";
import { Analytics } from "@vercel/analytics/react";
import AiChatPage from "./pages/AiChatPage";
import SearchPage from "./pages/SearchPage";
import NotificationPage from "./pages/Notification";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Define your routes
const routes = [
  {
    path: "/",
    element: <Navigate to="/onboarding" replace />,
  },
  {
    path: "/dashboard",
    element: <Index />,
  },
  {
    path: "/aiDoc",
    element: <AiChatPage />,
  },
  {
    path: "/onboarding",
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
  {
    path: "/messages",
    element: <Messages />,
  },
  {
    path: "/video-consultation",
    element: <VideoConsultation />,
  },
  {
    path: "/audio-consultation",
    element: <AudioConsultation />,
  },
  {
    path: "/consultation-booking",
    element: <ConsultationBooking />,
  },
  {
    path: "/doctor-dashboard",
    element: <DoctorDashboard />,
  },
  {
    path: "/prescriptions",
    element: <EPrescriptions />,
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
    path: "/search",
    element: <SearchPage />,
  },
  {
    path: "/notifications",
    element: <NotificationPage />,
  },
];

// Create a browser router
const router = createBrowserRouter(routes);

const App = () => {
  // Initialize QueryClient with useState
  const [queryClient] = useState(() => new QueryClient());

  return (
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
};

export default App;
