import React from "react";
import { CardContent } from "@/components/ui/card";
import { Building, Phone, Globe, Clock, Car } from "lucide-react";

export const HospitalInfo = ({ hospital }) => {
  return (
    <CardContent className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">About {hospital.name}</h3>
          <p className="text-muted-foreground">{hospital.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <h4 className="font-medium flex items-center">
                <Building className="h-4 w-4 mr-2 text-primary" />
                Hospital Address
              </h4>
              <p className="text-sm text-muted-foreground pl-6">
                {hospital.address}
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="font-medium flex items-center">
                <Phone className="h-4 w-4 mr-2 text-primary" />
                Contact Information
              </h4>
              <p className="text-sm text-muted-foreground pl-6">
                Phone: {hospital.phone}
              </p>
              <p className="text-sm text-muted-foreground pl-6">
                Website:{" "}
                <a
                  href={hospital.website}
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {hospital.website}
                </a>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <h4 className="font-medium flex items-center">
                <Clock className="h-4 w-4 mr-2 text-primary" />
                Hours of Operation
              </h4>
              <div className="text-sm text-muted-foreground pl-6">
                <div className="mb-1">
                  <span className="font-medium">Emergency:</span>{" "}
                  {hospital.hours.emergency}
                </div>
                <div>
                  <span className="font-medium">General Hours:</span>{" "}
                  {hospital.hours.general}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="font-medium flex items-center">
                <Car className="h-4 w-4 mr-2 text-primary" />
                Parking Information
              </h4>
              <p className="text-sm text-muted-foreground pl-6">
                {hospital.parkingInfo}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Hospital Facilities</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <div className="p-2 bg-primary/5 rounded-md text-sm">
              ✓ Emergency Department
            </div>
            <div className="p-2 bg-primary/5 rounded-md text-sm">
              ✓ Intensive Care Unit
            </div>
            <div className="p-2 bg-primary/5 rounded-md text-sm">
              ✓ Surgery Center
            </div>
            <div className="p-2 bg-primary/5 rounded-md text-sm">
              ✓ Diagnostic Imaging
            </div>
            <div className="p-2 bg-primary/5 rounded-md text-sm">
              ✓ Laboratory Services
            </div>
            <div className="p-2 bg-primary/5 rounded-md text-sm">
              ✓ Outpatient Clinic
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  );
};
