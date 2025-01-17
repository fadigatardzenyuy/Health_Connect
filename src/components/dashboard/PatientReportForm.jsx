import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const PatientReportForm = () => {
  const [formData, setFormData] = useState({
    patientName: "",
    symptoms: "",
    treatment: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.symptoms || !formData.treatment) {
      toast.error("Please fill in all fields");
      return;
    }
    console.log("Submitted report:", formData);
    toast.success("Patient report submitted successfully!");
    setFormData({ patientName: "", symptoms: "", treatment: "" });
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>New Patient Report</CardTitle>
        <CardDescription>Fill in the patient report details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patientName">Patient Name</Label>
            <Input 
              id="patientName" 
              placeholder="Enter patient name" 
              value={formData.patientName}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="symptoms">Symptoms</Label>
            <Textarea
              id="symptoms"
              placeholder="Describe the symptoms"
              className="min-h-[100px]"
              value={formData.symptoms}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="treatment">Treatment Notes</Label>
            <Textarea
              id="treatment"
              placeholder="Enter treatment details"
              className="min-h-[100px]"
              value={formData.treatment}
              onChange={handleChange}
            />
          </div>
          <Button type="submit" className="w-full">
            Submit Report
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};