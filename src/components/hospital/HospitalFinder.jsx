import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Phone,
  Star,
  Clock,
  User,
  Search,
  Filter,
  Building,
  BadgeCheck,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

export function HospitalFinder({ onHospitalSelect }) {
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("North-West");
  const [selectedType, setSelectedType] = useState("all");
  const [specialtiesList, setSpecialtiesList] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const bamendaAreas = [
    "Up Station",
    "Down Town",
    "Nkwen",
    "Mile 4",
    "Mile 3",
    "Mile 2",
    "Old Town",
    "Mankon",
    "Bambili",
    "Bambui",
    "Mendankwe",
    "Small Mankon",
    "Ntarinkon",
    "Ntamulung",
    "City Chemist",
  ];

  useEffect(() => {
    fetchHospitals();
  }, []);

  useEffect(() => {
    filterHospitals();
  }, [searchQuery, selectedSpecialty, selectedRegion, selectedType, hospitals]);

  const fetchHospitals = async () => {
    try {
      setIsLoading(true);

      const mockHospitals = [
        {
          id: "1",
          name: "Bamenda Regional Hospital",
          address: "Hospital Roundabout, Bamenda, North-West Region",
          phone: "+237 654 123 456",
          rating: 4.5,
          image_url: "/images/hospitals/bamenda-regional.jpg",
          wait_time: "45-60 min",
          specialties: [
            "General Medicine",
            "Surgery",
            "Pediatrics",
            "Obstetrics",
            "Emergency",
          ],
          verified: true,
          region: "North-West",
          city: "Bamenda",
          type: "public",
          beds: 200,
        },
        {
          id: "2",
          name: "St. Mary Soledad Catholic Hospital",
          address: "Mile 4 Nkwen, Bamenda, North-West Region",
          phone: "+237 654 789 012",
          rating: 4.8,
          image_url: "/images/hospitals/st-mary-soledad.jpg",
          wait_time: "20-30 min",
          specialties: [
            "Maternal Health",
            "Pediatrics",
            "Surgery",
            "General Medicine",
          ],
          verified: true,
          region: "North-West",
          city: "Bamenda",
          type: "mission",
          beds: 150,
        },
        {
          id: "3",
          name: "Mbingo Baptist Hospital",
          address: "Mbingo, North-West Region",
          phone: "+237 677 123 456",
          rating: 4.7,
          image_url: "/images/hospitals/mbingo-baptist.jpg",
          wait_time: "30-45 min",
          specialties: [
            "Orthopedics",
            "Eye Care",
            "General Medicine",
            "Surgery",
          ],
          verified: true,
          region: "North-West",
          city: "Mbingo",
          type: "mission",
          beds: 180,
        },
        {
          id: "4",
          name: "Mezam Polyclinic",
          address: "Commercial Avenue, Bamenda, North-West Region",
          phone: "+237 677 987 654",
          rating: 4.3,
          image_url: "/images/hospitals/mezam-polyclinic.jpg",
          wait_time: "15-20 min",
          specialties: [
            "General Medicine",
            "Cardiology",
            "Laboratory Services",
          ],
          verified: true,
          region: "North-West",
          city: "Bamenda",
          type: "private",
          beds: 60,
        },
        {
          id: "5",
          name: "Bencham Medical Centre",
          address: "Up Station, Bamenda, North-West Region",
          phone: "+237 678 123 789",
          rating: 4.1,
          image_url: "/images/hospitals/bencham-medical.jpg",
          wait_time: "10-15 min",
          specialties: ["General Medicine", "Pediatrics", "Minor Surgery"],
          verified: false,
          region: "North-West",
          city: "Bamenda",
          type: "private",
          beds: 30,
        },
        {
          id: "6",
          name: "Montana Health Services",
          address: "Ngomgham, Bamenda, North-West Region",
          phone: "+237 679 456 789",
          rating: 3.9,
          image_url: "/images/hospitals/montana-health.jpg",
          wait_time: "15-25 min",
          specialties: ["General Medicine", "Gynecology"],
          verified: false,
          region: "North-West",
          city: "Bamenda",
          type: "private",
          beds: 25,
        },
        {
          id: "7",
          name: "Foncha Street Clinic",
          address: "Foncha Street, Bamenda, North-West Region",
          phone: "+237 651 987 123",
          rating: 3.8,
          image_url: "/images/hospitals/foncha-clinic.jpg",
          wait_time: "10-15 min",
          specialties: ["General Medicine", "Physiotherapy"],
          verified: false,
          region: "North-West",
          city: "Bamenda",
          type: "private",
          beds: 15,
        },
      ];

      const allSpecialties = new Set();
      mockHospitals.forEach((hospital) => {
        hospital.specialties.forEach((specialty) => {
          allSpecialties.add(specialty);
        });
      });

      setSpecialtiesList(Array.from(allSpecialties).sort());
      setHospitals(mockHospitals);
      setFilteredHospitals(mockHospitals);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterHospitals = () => {
    let filtered = [...hospitals];

    if (searchQuery) {
      filtered = filtered.filter(
        (hospital) =>
          hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hospital.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hospital.specialties.some((s) =>
            s.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    if (selectedSpecialty && selectedSpecialty !== "all") {
      filtered = filtered.filter((hospital) =>
        hospital.specialties.includes(selectedSpecialty)
      );
    }

    if (selectedRegion && selectedRegion !== "all") {
      filtered = filtered.filter(
        (hospital) =>
          hospital.city === selectedRegion || hospital.region === selectedRegion
      );
    }

    if (selectedType && selectedType !== "all") {
      filtered = filtered.filter((hospital) => hospital.type === selectedType);
    }

    setFilteredHospitals(filtered);
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />
      );
    }

    if (halfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-4 h-4 text-yellow-400" />
          <div className="absolute top-0 left-0 overflow-hidden w-1/2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search hospitals, specialties, or areas in Bamenda..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filter Hospitals</DialogTitle>
              <DialogDescription>
                Find the right healthcare facility in Bamenda and surrounding
                areas
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Specialty</label>
                <Select
                  value={selectedSpecialty}
                  onValueChange={setSelectedSpecialty}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Specialties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialties</SelectItem>
                    {specialtiesList.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Area</label>
                <Select
                  value={selectedRegion}
                  onValueChange={setSelectedRegion}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="North-West">
                      North-West Region
                    </SelectItem>
                    <SelectItem value="Bamenda">All Bamenda</SelectItem>
                    <SelectGroup>
                      <SelectLabel>Bamenda Areas</SelectLabel>
                      {bamendaAreas.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Hospital Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="public">Public Hospital</SelectItem>
                    <SelectItem value="private">Private Clinic</SelectItem>
                    <SelectItem value="mission">Mission Hospital</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedSpecialty("all");
                  setSelectedRegion("North-West");
                  setSelectedType("all");
                }}
              >
                Reset Filters
              </Button>
              <Button onClick={() => setIsFilterOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row gap-4 p-4">
                  <Skeleton className="h-24 w-24 rounded-md flex-shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/3" />
                    <div className="flex space-x-1 pt-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredHospitals.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Building className="h-12 w-12 mx-auto text-gray-300" />
            <h3 className="mt-4 text-lg font-medium">No hospitals found</h3>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your search or filters
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredHospitals.map((hospital) => (
            <Card
              key={hospital.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onHospitalSelect(hospital.id)}
            >
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row gap-4 p-4">
                  <div className="relative h-24 w-32 rounded-md bg-gray-100 flex-shrink-0 overflow-hidden">
                    {hospital.image_url ? (
                      <img
                        src={hospital.image_url}
                        alt={hospital.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <Building className="h-12 w-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                    )}
                    {hospital.verified && (
                      <Badge className="absolute top-1 right-1 bg-green-100 text-green-800 border-0">
                        <BadgeCheck className="h-3 w-3 mr-1" /> Verified
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{hospital.name}</h3>
                      <Badge
                        variant={
                          hospital.type === "public"
                            ? "default"
                            : hospital.type === "mission"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {hospital.type === "public"
                          ? "Public"
                          : hospital.type === "mission"
                          ? "Mission"
                          : "Private"}
                      </Badge>
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      {hospital.address}
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="h-3 w-3 mr-1" />
                      {hospital.phone}
                    </div>

                    <div className="flex flex-wrap gap-1 mt-1">
                      {hospital.specialties.slice(0, 3).map((specialty, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {specialty}
                        </Badge>
                      ))}
                      {hospital.specialties.length > 3 && (
                        <Badge variant="outline" className="bg-gray-50">
                          +{hospital.specialties.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center">
                        <div className="flex mr-1">
                          {renderRatingStars(hospital.rating)}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({hospital.rating})
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-3 w-3 mr-1 text-amber-500" />
                          <span>Wait: {hospital.wait_time}</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <User className="h-3 w-3 mr-1 text-blue-500" />
                          <span>{hospital.beds} beds</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
