import { useEffect, useState } from "react";
import { Search, MapPin, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase.js";

export function DoctorSearch() {
  const [doctors, setDoctors] = useState([]); // State to store all doctors
  const [filteredDoctors, setFilteredDoctors] = useState([]); // State to store filtered doctors
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [locationQuery, setLocationQuery] = useState(""); // State for location query

  // Fetch the first 10 doctors from Supabase on component mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Fetch doctors from Supabase
  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .limit(10); // Fetch only the first 10 doctors

      if (error) throw error;

      setDoctors(data);
      setFilteredDoctors(data); // Initialize filtered doctors with the fetched data
    } catch (error) {
      console.error("Error fetching doctors:", error.message);
    }
  };

  // Handle search input changes
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter doctors based on the search query
    const filtered = doctors.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(query) ||
        doctor.specialty.toLowerCase().includes(query) ||
        doctor.location.toLowerCase().includes(query)
    );

    setFilteredDoctors(filtered);
  };

  // Handle location input changes
  const handleLocationChange = (e) => {
    const query = e.target.value.toLowerCase();
    setLocationQuery(query);

    // Filter doctors based on the location query
    const filtered = doctors.filter((doctor) =>
      doctor.location.toLowerCase().includes(query)
    );

    setFilteredDoctors(filtered);
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setLocationQuery("");
    setFilteredDoctors(doctors); // Reset to the original list of doctors
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Search by Name or Specialty */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search doctors by name or specialty"
            className="pl-9"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {/* Search by Location */}
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Location (City, Hospital)"
            className="pl-9"
            value={locationQuery}
            onChange={handleLocationChange}
          />
        </div>

        {/* Reset Filters Button */}
        <Button
          variant="outline"
          className="w-full md:w-auto"
          onClick={handleResetFilters}
        >
          <Filter className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      </div>

      {/* Doctors List */}
      <div className="grid gap-4">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Doctor Image */}
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />

                  {/* Doctor Details */}
                  <div className="flex-1">
                    {/* Name and Specialty */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{doctor.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {doctor.specialty}
                        </p>
                      </div>
                      {/* Availability Badge */}
                      <Badge variant="outline" className="bg-accent">
                        {doctor.availability}
                      </Badge>
                    </div>

                    {/* Location and Rating */}
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

                    {/* Languages */}
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

                    {/* Action Buttons */}
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
          ))
        ) : (
          <p className="text-center text-muted-foreground">No doctors found.</p>
        )}
      </div>
    </div>
  );
}
