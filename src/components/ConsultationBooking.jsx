import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { VideoPreview } from "./consultation/VideoPreview";
import { ConsultationForm } from "./consultation/ConsultationForm";
import { TimeSlotPicker } from "./consultation/TimeSlotPicker";
import { PrescriptionForm } from "./consultation/PrescriptionForm";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DoctorSearch } from "./DoctorSearch";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export function ConsultationBooking() {
  const [selectedDate, setSelectedDate] = useState();
  const [selectedTime, setSelectedTime] = useState();
  const [selectedDoctor, setSelectedDoctor] = useState();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBooking = async (data) => {
    if (!selectedDate || !selectedTime || !selectedDoctor || !user) {
      toast({
        title: "Incomplete Booking",
        description:
          "Please select a doctor, date, and time for your consultation.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Attempting to book appointment with data:", {
        patient_id: user.id,
        doctor_id: selectedDoctor,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        ...data,
      });

      const { error } = await supabase.from("appointments").insert({
        patient_id: user.id,
        doctor_id: selectedDoctor,
        symptoms: data.symptoms,
        medical_history: data.medicalHistory,
        allergies: data.allergies || null,
        current_medications: data.currentMedications || null,
        appointment_date: selectedDate.toISOString(),
        appointment_time: selectedTime,
        status: "pending",
      });

      if (error) {
        console.error("Booking error:", error);
        throw error;
      }

      toast({
        title: "Consultation Booked",
        description: "Your consultation has been scheduled successfully.",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error booking consultation:", error);
      toast({
        title: "Booking Failed",
        description:
          "There was an error booking your consultation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDoctorSelect = (doctorId) => {
    console.log("Selected doctor:", doctorId);
    setSelectedDoctor(doctorId);
  };

  const handlePrescription = (data) => {
    console.log("Prescription created:", data);
    toast({
      title: "Prescription Created",
      description: "The prescription has been created successfully.",
    });
  };

  if (!user) {
    return (
      <Card className="w-full max-w-4xl mx-auto px-4 py-8">
        <CardContent className="flex flex-col items-center justify-center space-y-4">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <h2 className="text-xl font-semibold">Authentication Required</h2>
          <p className="text-muted-foreground text-center">
            Please sign in to book a consultation
          </p>
          <Button onClick={() => navigate("/signin")}>Sign In</Button>
        </CardContent>
      </Card>
    );
  }

  if (user?.role === "doctor") {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">
              Doctor Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="consultations" className="space-y-4">
              <TabsList>
                <TabsTrigger value="consultations">
                  Upcoming Consultations
                </TabsTrigger>
                <TabsTrigger value="prescriptions">
                  Write Prescription
                </TabsTrigger>
              </TabsList>
              <TabsContent value="consultations">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Today's Schedule</h3>
                  <p className="text-muted-foreground">
                    No consultations scheduled for today.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="prescriptions">
                <PrescriptionForm onSubmit={handlePrescription} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <Card className="bg-white shadow-lg mb-6">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl md:text-3xl font-bold text-primary text-center">
            Find Available Doctors
          </CardTitle>
          <p className="text-muted-foreground text-center">
            Search for doctors and book your consultation
          </p>
        </CardHeader>
        <CardContent>
          <DoctorSearch onDoctorSelect={handleDoctorSelect} />
        </CardContent>
      </Card>

      {selectedDoctor && (
        <Card className="bg-white shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl md:text-3xl font-bold text-primary text-center">
              Book Your Consultation
            </CardTitle>
            <p className="text-muted-foreground text-center">
              Choose your preferred date and time for the consultation
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <VideoPreview />
                <TimeSlotPicker
                  onTimeSelect={setSelectedTime}
                  selectedTime={selectedTime}
                />
              </div>
              <div className="space-y-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border mx-auto"
                  disabled={(date) => date < new Date()}
                />
                <ConsultationForm onSubmit={handleBooking} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
