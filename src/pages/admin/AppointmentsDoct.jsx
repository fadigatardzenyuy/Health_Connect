import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Check, X } from "lucide-react";

export default function Appointments() {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patient: "John Doe",
      type: "General Checkup",
      date: "2024-02-20",
      time: "09:00 AM",
      status: "Pending",
    },
    {
      id: 2,
      patient: "Jane Smith",
      type: "Follow-up",
      date: "2024-02-20",
      time: "10:00 AM",
      status: "Approved",
    },
    {
      id: 3,
      patient: "Mike Johnson",
      type: "Consultation",
      date: "2024-02-20",
      time: "11:00 AM",
      status: "Pending",
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleApprove = (id) => {
    setAppointments(
      appointments.map((app) =>
        app.id === id ? { ...app, status: "Approved" } : app
      )
    );
  };

  const handleReject = (id) => {
    setSelectedAppointment(appointments.find((app) => app.id === id));
    setOpenDialog(true);
  };

  const confirmReject = () => {
    setAppointments(
      appointments.map((app) =>
        app.id === selectedAppointment.id ? { ...app, status: "Rejected" } : app
      )
    );
    setOpenDialog(false);
  };

  const columns = [
    { field: "patient", headerName: "Patient", width: 150 },
    { field: "type", headerName: "Type", width: 150 },
    { field: "date", headerName: "Date", width: 110 },
    { field: "time", headerName: "Time", width: 110 },
    { field: "status", headerName: "Status", width: 110 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <div>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<Check />}
            onClick={() => handleApprove(params.row.id)}
            disabled={params.row.status !== "Pending"}
            style={{ marginRight: 8 }}
          >
            Approve
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            startIcon={<X />}
            onClick={() => handleReject(params.row.id)}
            disabled={params.row.status !== "Pending"}
          >
            Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Typography variant="h4" className="mb-6">
        Appointments
      </Typography>

      <Card>
        <CardContent>
          <DataGrid
            rows={appointments}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            checkboxSelection
            disableSelectionOnClick
            autoHeight
          />
        </CardContent>
      </Card>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Reject Appointment?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to reject this appointment? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmReject} color="secondary" autoFocus>
            Confirm Reject
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
