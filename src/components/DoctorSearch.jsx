import { Search, MapPin, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    location: "Yaoundé Central Hospital",
    rating: 4.8,
    reviews: 124,
    image: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=random",
    availability: "Available today",
    languages: ["English", "French"],
  },
  {
    id: 2,
    name: "Dr. Michael Brown",
    specialty: "Dermatologist",
    location: "Douala General Hospital",
    rating: 4.9,
    reviews: 89,
    image: "https://ui-avatars.com/api/?name=Michael+Brown&background=random",
    availability: "Next available: Tomorrow",
    languages: ["French", "English", "Fulfulde"],
  },
  {
    id: 3,
    name: "Dr. Emily White",
    specialty: "General Practitioner",
    location: "Bamenda Regional Hospital",
    rating: 4.7,
    reviews: 156,
    image: "https://ui-avatars.com/api/?name=Emily+White&background=random",
    availability: "Available today",
    languages: ["English", "French"],
  },
];

export function DoctorSearch() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search doctors by name or specialty"
            className="pl-9"
          />
        </div>
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Location (City, Hospital)" className="pl-9" />
        </div>
        <Button variant="outline" className="w-full md:w-auto">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="grid gap-4">
        {doctors.map((doctor) => (
          <Card key={doctor.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{doctor.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {doctor.specialty}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-accent">
                      {doctor.availability}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{doctor.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">
                        {doctor.rating}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({doctor.reviews} reviews)
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    {doctor.languages.map((language) => (
                      <Badge
                        key={language}
                        variant="secondary"
                        className="mr-1"
                      >
                        {language}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm">Book Appointment</Button>
                    <Button size="sm" variant="outline">
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
