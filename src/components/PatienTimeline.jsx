import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { Circle } from "lucide-react";

export default function PatientTimeline({ events }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" className="mb-4">
          Patient History Timeline
        </Typography>
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={index} className="flex">
              <div className="flex flex-col items-center">
                <Circle className="h-4 w-4 text-blue-500" />
                {index !== events.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-200 mt-1" />
                )}
              </div>
              <div className="ml-4">
                <Typography variant="subtitle2" className="font-medium">
                  {event.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {event.date}
                </Typography>
                <Typography variant="body2" className="mt-1">
                  {event.description}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
