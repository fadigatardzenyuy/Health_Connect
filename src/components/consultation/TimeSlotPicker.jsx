import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Calendar } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export function TimeSlotPicker({ onTimeSelect, selectedTime }) {
  const [availableSlots] = useState([
    { time: "09:00 AM", available: true },
    { time: "09:30 AM", available: true },
    { time: "10:00 AM", available: true },
    { time: "10:30 AM", available: true },
    { time: "11:00 AM", available: true },
    { time: "11:30 AM", available: true },
    { time: "02:00 PM", available: true },
    { time: "02:30 PM", available: false },
    { time: "03:00 PM", available: true },
    { time: "03:30 PM", available: true },
    { time: "04:00 PM", available: false },
    { time: "04:30 PM", available: true },
  ]);

  const morningSlots = availableSlots.filter(
    (slot) => slot.time.includes("AM") && slot.available
  );

  const afternoonSlots = availableSlots.filter(
    (slot) => slot.time.includes("PM") && slot.available
  );

  return (
    <div className="space-y-4 bg-white rounded-xl p-5 shadow-sm">
      <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
        <Clock className="w-5 h-5 text-primary" />
        Available Time Slots
      </h3>

      <div className="space-y-4">
        <div>
          <div className="flex items-center mb-2">
            <Badge
              variant="outline"
              className="rounded-full bg-orange-100 text-orange-800 border-none"
            >
              Morning
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {morningSlots.map((slot) => (
              <Button
                key={slot.time}
                variant={selectedTime === slot.time ? "default" : "outline"}
                className={`w-full justify-start ${
                  selectedTime === slot.time
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-primary/10"
                }`}
                onClick={() => onTimeSelect(slot.time)}
                disabled={!slot.available}
              >
                <Clock className="mr-2 h-4 w-4" />
                {slot.time}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center mb-2">
            <Badge
              variant="outline"
              className="rounded-full bg-blue-100 text-blue-800 border-none"
            >
              Afternoon
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {afternoonSlots.map((slot) => (
              <Button
                key={slot.time}
                variant={selectedTime === slot.time ? "default" : "outline"}
                className={`w-full justify-start ${
                  selectedTime === slot.time
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-primary/10"
                }`}
                onClick={() => onTimeSelect(slot.time)}
                disabled={!slot.available}
              >
                <Clock className="mr-2 h-4 w-4" />
                {slot.time}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t mt-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Select a time slot and date to proceed</span>
        </div>
      </div>
    </div>
  );
}
