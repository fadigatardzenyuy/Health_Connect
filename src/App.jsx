import React from "react";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import Dashboard from "./pages/patient/Dashboard";
import UserProfile from "./pages/patient/UserProfile";
import ProfileEdit from "./pages/patient/ProfileEdit";
import Admin from "./pages/admin/Admin";
import SignUpPage from "./components/SignUp";
import SignInPage from "./components/Login";
import Onboarding from "./pages/patient/Onboarding";
import MedicalReportPurchase from "./components/MedicalReport";
import AppointmentForm from "./pages/patient/Appointment";
import BottomNavigation from "./components/BottomNavigation";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtecteRoute";
// import ProtectedRoute from "./components/ProtectedRoute";
// Import your ProtectedRoute component

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
            <Admin />
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

// src/pages/admin/AdminDashboard.jsx
// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import { ThemeProvider, createTheme } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";
// import Dashboard from "./pages/admin/AdminDashboard";
// import Appointments from "./pages/admin/AppointmentsDoct";
// import VideoConsultations from "./pages/admin/VideoConsultation";
// import MedicalRecords from "./pages/admin/MedicalRecords";
// import PatientList from "./pages/admin/PatientList";
// import Settings from "./pages/admin/Settings";
// import Layout from "./components/Layout";

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#0F52BA",
//     },
//     secondary: {
//       main: "#147AFC",
//     },
//   },
// });

// function App() {
//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <Router>
//         <Layout>
//           <Routes>
//             <Route path="/" element={<Dashboard />} />
//             <Route path="/appointments" element={<Appointments />} />
//             <Route
//               path="/video-consultations"
//               element={<VideoConsultations />}
//             />
//             <Route path="/medical-records" element={<MedicalRecords />} />
//             <Route path="/patients" element={<PatientList />} />
//             <Route path="/settings" element={<Settings />} />
//           </Routes>
//         </Layout>
//       </Router>
//     </ThemeProvider>
//   );
// }

// export default App;
