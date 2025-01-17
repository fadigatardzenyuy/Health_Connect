import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from "@mui/material";

const initialAppointments = [
  {
    id: 1,
    patient: "John Doe",
    date: "2023-05-15",
    time: "10:00 AM",
    status: "Pending",
  },
  {
    id: 2,
    patient: "Jane Smith",
    date: "2023-05-15",
    time: "11:30 AM",
    status: "Approved",
  },
  {
    id: 3,
    patient: "Bob Johnson",
    date: "2023-05-16",
    time: "2:00 PM",
    status: "Pending",
  },
];

function AppointmentManagement() {
  const [appointments, setAppointments] = useState(initialAppointments);

  const handleApprove = (id) => {
    setAppointments(
      appointments.map((app) =>
        app.id === id ? { ...app, status: "Approved" } : app
      )
    );
  };

  const handleReject = (id) => {
    setAppointments(
      appointments.map((app) =>
        app.id === id ? { ...app, status: "Rejected" } : app
      )
    );
  };

  return (
    <div className="p-6">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Appointment Management
      </Typography>
      <TableContainer component={Paper} className="shadow-md">
        <Table>
          <TableHead>
            <TableRow className="bg-primary">
              <TableCell className="text-white">Patient</TableCell>
              <TableCell className="text-white">Date</TableCell>
              <TableCell className="text-white">Time</TableCell>
              <TableCell className="text-white">Status</TableCell>
              <TableCell className="text-white">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id} className="hover:bg-gray-50">
                <TableCell>{appointment.patient}</TableCell>
                <TableCell>{appointment.date}</TableCell>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>{appointment.status}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    className="mr-2"
                    onClick={() => handleApprove(appointment.id)}
                    disabled={appointment.status === "Approved"}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => handleReject(appointment.id)}
                    disabled={appointment.status === "Rejected"}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default AppointmentManagement;
