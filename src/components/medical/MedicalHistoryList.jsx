import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock data - replace with actual data source
const mockMedicalHistory = [
  {
    id: 1,
    condition: "Hypertension",
    date: "2023-01-15",
    doctor: "Dr. Smith",
    treatment: "Prescribed medication",
    notes: "Regular monitoring required",
  },
  {
    id: 2,
    condition: "Allergic Rhinitis",
    date: "2023-03-20",
    doctor: "Dr. Johnson",
    treatment: "Antihistamines",
    notes: "Seasonal allergies",
  },
];

export function MedicalHistoryList() {
  const { toast } = useToast();

  const handleDelete = (id) => {
    toast({
      title: "Record Deleted",
      description: "The medical history record has been deleted.",
    });
  };

  const handleView = (id) => {
    toast({
      title: "Viewing Record",
      description: "Opening detailed view of the medical record.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Treatment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockMedicalHistory.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.condition}</TableCell>
                <TableCell>{record.doctor}</TableCell>
                <TableCell>{record.treatment}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(record.id)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(record.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
