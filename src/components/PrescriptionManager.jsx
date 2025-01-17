import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { Plus } from "lucide-react";

export default function PrescriptionManager() {
  const [prescriptions] = React.useState([
    {
      id: 1,
      medication: "Amoxicillin",
      dosage: "500mg",
      frequency: "Twice daily",
      duration: "7 days",
    },
    {
      id: 2,
      medication: "Ibuprofen",
      dosage: "400mg",
      frequency: "As needed",
      duration: "5 days",
    },
  ]);

  return (
    <Card>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h6">Prescriptions</Typography>
          <Button
            variant="contained"
            startIcon={<Plus className="h-4 w-4" />}
            size="small"
          >
            Add Prescription
          </Button>
        </div>
        <div className="space-y-4">
          {prescriptions.map((prescription) => (
            <div
              key={prescription.id}
              className="p-4 border rounded-lg bg-gray-50"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Typography variant="subtitle2" color="textSecondary">
                    Medication
                  </Typography>
                  <Typography>{prescription.medication}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">
                    Dosage
                  </Typography>
                  <Typography>{prescription.dosage}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">
                    Frequency
                  </Typography>
                  <Typography>{prescription.frequency}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">
                    Duration
                  </Typography>
                  <Typography>{prescription.duration}</Typography>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
