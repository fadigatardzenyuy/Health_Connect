import React, { useState } from "react";
import {
  TextField,
  Card,
  CardContent,
  Typography,
  Button,
  Tab,
  Tabs,
  Grid,
} from "@mui/material";
import PatientTimeline from "../../components/PatienTimeline";
import PrescriptionManager from "../../components/PrescriptionManager";

export default function MedicalRecords() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [patientDetails, setPatientDetails] = useState({
    name: "",
    dob: "",
    gender: "",
    contact: "",
    address: "",
    medicalHistory: "",
    allergies: "",
  });

  const timelineEvents = [
    {
      title: "General Checkup",
      date: "2024-01-10",
      description:
        "Regular health checkup. Blood pressure normal, weight stable.",
    },
    {
      title: "Prescription Updated",
      date: "2024-01-08",
      description: "Added new medication for blood pressure management.",
    },
    {
      title: "Lab Results",
      date: "2024-01-05",
      description:
        "Blood work results received. All parameters within normal range.",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Patient Details:", patientDetails);
    // Here you would typically send the data to a server
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
        <p className="text-gray-600">Manage patient medical records</p>
      </div>

      <TextField
        fullWidth
        placeholder="Search patient records..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        variant="outlined"
        className="mb-6"
      />

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        className="mb-6"
      >
        <Tab label="Patient Details" />
        <Tab label="Medical History" />
        <Tab label="Prescriptions" />
      </Tabs>

      {activeTab === 0 && (
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Patient Name"
                    name="name"
                    value={patientDetails.name}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    name="dob"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={patientDetails.dob}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Gender"
                    name="gender"
                    value={patientDetails.gender}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contact Number"
                    name="contact"
                    value={patientDetails.contact}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    multiline
                    rows={2}
                    value={patientDetails.address}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Medical History"
                    name="medicalHistory"
                    multiline
                    rows={4}
                    value={patientDetails.medicalHistory}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Allergies"
                    name="allergies"
                    multiline
                    rows={2}
                    value={patientDetails.allergies}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">
                    Save Patient Details
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === 1 && <PatientTimeline events={timelineEvents} />}
      {activeTab === 2 && <PrescriptionManager />}
    </div>
  );
}
