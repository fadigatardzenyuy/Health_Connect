import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock } from "lucide-react";

export function TimeSlotPicker({ onTimeSelect }) {
  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Available Time Slots
      </h3>
      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
        <div className="grid grid-cols-2 gap-2">
          {timeSlots.map((time) => (
            <Button
              key={time}
              variant="outline"
              className="w-full"
              onClick={() => onTimeSelect(time)}
            >
              {time}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
