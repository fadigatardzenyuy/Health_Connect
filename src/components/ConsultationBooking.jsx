import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { VideoPreview } from "./consultation/VideoPreview";
import { ConsultationForm } from "./consultation/ConsultationForm";
import { TimeSlotPicker } from "./consultation/TimeSlotPicker";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";

export function ConsultationBooking() {
  const [selectedDate, setSelectedDate] = useState();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleBooking = (data) => {
    console.log("Consultation booked:", data);
    toast({
      title: "Consultation Booked",
      description: "Your consultation has been scheduled successfully.",
    });
  };

  if (user?.role === "doctor") {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <Card className="bg-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 text-muted-foreground">
              <AlertCircle className="w-6 h-6" />
              <p>
                Doctors cannot book consultations. Please use the doctor
                dashboard to manage your appointments.
              </p>
            </div>
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
              <TimeSlotPicker onTimeSelect={(time) => console.log(time)} />
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
