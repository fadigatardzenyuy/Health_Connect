import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";

export const AppointmentCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      toast.info(`Selected date: ${selectedDate.toLocaleDateString()}`);
      console.log("Selected appointment date:", selectedDate);
    }
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Appointment Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          className="rounded-md border"
        />
      </CardContent>
    </Card>
  );
};