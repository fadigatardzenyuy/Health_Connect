import React from "react";
import { Clock, Users, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DepartmentList = ({ departments = [], onSelectDepartment }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-4">Hospital Departments</h3>

      <div className="space-y-4">
        {departments.map((department) => (
          <div
            key={department.id}
            className="border rounded-lg p-4 hover:border-primary transition-colors"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-lg">{department.name}</h4>
                <p className="text-muted-foreground">
                  {department.description}
                </p>

                <div className="flex flex-wrap gap-4 pt-1">
                  <div className="flex items-center gap-1 text-sm">
                    <MapPin className="h-3 w-3 text-primary" />
                    <span>{department.floorNumber}</span>
                  </div>

                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="h-3 w-3 text-primary" />
                    <span>Current wait: {department.waitTime}</span>
                  </div>

                  <div className="flex items-center gap-1 text-sm">
                    <Users className="h-3 w-3 text-primary" />
                    <span>{department.doctorCount} doctors</span>
                  </div>
                </div>
              </div>

              <Button
                className="self-end md:self-center whitespace-nowrap"
                variant="outline"
                onClick={() => onSelectDepartment(department.id)}
              >
                View Doctors
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
