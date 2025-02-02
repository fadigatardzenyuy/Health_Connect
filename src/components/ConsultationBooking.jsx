import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { VideoPreview } from "./consultation/VideoPreview";
import { ConsultationForm } from "./consultation/ConsultationForm";
import { TimeSlotPicker } from "./consultation/TimeSlotPicker";
import { PrescriptionForm } from "./consultation/PrescriptionForm";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ConsultationBooking() {
  const [selectedDate, setSelectedDate] = useState();
  const [selectedTime, setSelectedTime] = useState();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleBooking = (data) => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Incomplete Booking",
        description:
          "Please select both a date and time for your consultation.",
        variant: "destructive",
      });
      return;
    }

    const bookingData = {
      ...data,
      date: selectedDate,
      time: selectedTime,
    };

    console.log("Consultation booked:", bookingData);
    toast({
      title: "Consultation Booked",
      description: "Your consultation has been scheduled successfully.",
    });
  };

  const handlePrescription = (data) => {
    console.log("Prescription created:", data);
    toast({
      title: "Prescription Created",
      description: "The prescription has been created successfully.",
    });
  };

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
    </div>
  );
}
