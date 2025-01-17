import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Search, UserPlus } from "lucide-react";

export default function PatientList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients] = useState([
    {
      id: 1,
      name: "John Doe",
      age: 35,
      gender: "Male",
      lastVisit: "2024-01-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 28,
      gender: "Female",
      lastVisit: "2024-01-20",
    },
    {
      id: 3,
      name: "Mike Johnson",
      age: 42,
      gender: "Male",
      lastVisit: "2024-01-18",
    },
    {
      id: 4,
      name: "Emily Brown",
      age: 31,
      gender: "Female",
      lastVisit: "2024-01-22",
    },
  ]);

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Patient List</h1>
        <p className="text-gray-600">Manage and view patient information</p>
      </div>

      <Card className="mb-6">
        <CardContent>
          <div className="flex items-center justify-between">
            <TextField
              placeholder="Search patients..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Search className="mr-2 h-5 w-5 text-gray-400" />
                ),
              }}
              className="w-full max-w-md"
              label="Search patients"
              aria-label="Search patients"
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<UserPlus />}
            >
              Add New Patient
            </Button>
          </div>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Last Visit</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>{patient.lastVisit}</TableCell>
                  <TableCell>
                    <Button variant="outlined" size="small" className="mr-2">
                      View
                    </Button>
                    <Button variant="outlined" size="small" color="secondary">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography>No patients found.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
