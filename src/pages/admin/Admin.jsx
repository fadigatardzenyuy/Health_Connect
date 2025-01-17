// src/pages/admin/AdminDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Dashboard from "./AdminDashboard"; // Your actual admin dashboard component
import Appointments from "./AppointmentsDoct";
import VideoConsultations from "./VideoConsultation";
import PatientList from "./PatientList";
import Settings from "./Settings";
import MedicalRecords from "./MedicalRecords";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0F52BA",
    },
    secondary: {
      main: "#147AFC",
    },
  },
});

const Admin = () => {
  const navigate = useNavigate();

  const switchToUserDashboard = () => {
    navigate("/");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <h1>Admin Dashboard</h1>
        <button onClick={switchToUserDashboard}>
          Switch to User Dashboard
        </button>
        {/* Admin Routes */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/video-consultations" element={<VideoConsultations />} />
          <Route path="/medical-records" element={<MedicalRecords />} />
          <Route path="/patients" element={<PatientList />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
};

export default Admin;
