import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, Clock, GraduationCap, Calendar } from "lucide-react";

export const DoctorCard = ({ doctor, onSelect }) => {
  return (
    <Card className="hover:border-primary transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={doctor.imageUrl} alt={doctor.name} />
            <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="font-medium">{doctor.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {doctor.specialty}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="font-medium">{doctor.rating}</span>
                <span className="text-xs text-muted-foreground">
                  ({doctor.reviewCount} reviews)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div className="flex items-center gap-1 text-sm">
                <GraduationCap className="h-3 w-3 text-primary" />
                <span>{doctor.education}</span>
              </div>

              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-3 w-3 text-primary" />
                <span>{doctor.experience} experience</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 pt-3 border-t">
              <div className="flex flex-col mb-2 sm:mb-0">
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="h-3 w-3 text-primary" />
                  <span className="text-muted-foreground">Next available:</span>
                  <span className="font-medium">{doctor.nextAvailable}</span>
                </div>

                {doctor.acceptingNewPatients ? (
                  <Badge className="bg-green-100 text-green-800 self-start mt-1 hover:bg-green-200">
                    Accepting new patients
                  </Badge>
                ) : (
                  <Badge variant="outline" className="self-start mt-1">
                    Not accepting new patients
                  </Badge>
                )}
              </div>

              <Button
                size="sm"
                disabled={!doctor.acceptingNewPatients}
                onClick={onSelect}
              >
                Book Appointment
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
