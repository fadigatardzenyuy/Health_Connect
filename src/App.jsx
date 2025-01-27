import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Navigate,
} from "react-router-dom";
import Index from "./pages/Index";
import VideoConsultation from "./pages/VideoConsultation";
import AudioConsultation from "./pages/AudioConsultation";
import ConsultationBooking from "./pages/ConsultationBooking";
import DoctorDashboard from "./pages/DoctorDashboard";
import Onboarding from "./pages/Onboarding";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import "./index.css";

// Create the query client for react-query
const queryClient = new QueryClient();

// Define your routes
const routes = [
  {
    path: "/",
    element: <Navigate to="/onboarding" replace />,
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
    path: "/dashboard",
    element: <Index />,
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
  // Uncomment if needed
  // {
  //   path: "/doctor-dashboard",
  //   element: <DoctorDashboard />,
  // },
];

// Create a browser router with the future flags enabled
const router = createBrowserRouter(routes, {
  future: {
    v7_relativeSplatPath: true, // Enable the relative splat path flag
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RouterProvider router={router} />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
