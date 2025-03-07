import { useState, useEffect, useRef } from "react";
import {
  Search,
  MapPin,
  Filter,
  Star,
  Calendar,
  Clock,
  ChevronDown,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ConsultationForm } from "../consultation/ConsultationForm";
import { TimeSlotPicker } from "../consultation/TimeSlotPicker";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function EnhancedDoctorSearch({ onDoctorSelect }) {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [availabilityFilter, setAvailabilityFilter] = useState([]);
  const [ratingRange, setRatingRange] = useState([0, 5]);
  const [experienceRange, setExperienceRange] = useState([0, 30]);
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(false);
  const searchInputRef = useRef(null);

  const { toast } = useToast();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Fetch all doctors initially
  useEffect(() => {
    const fetchAllDoctors = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("role", "doctor")
          .order("rating", { ascending: false });

        if (error) throw error;

        setDoctors(data || []);
        setFilteredDoctors(data || []);

        const uniqueSpecializations = Array.from(
          new Set(data?.map((doctor) => doctor.specialization).filter(Boolean))
        );
        setSpecializations(uniqueSpecializations);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast({
          title: "Error",
          description: "Failed to load doctors. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllDoctors();
  }, [toast]);

  // Filter doctors based on search and filter criteria
  useEffect(() => {
    const filterDoctors = () => {
      let filtered = [...doctors];

      // Filter by search query
      if (searchQuery) {
        filtered = filtered.filter(
          (doctor) =>
            doctor.full_name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            doctor.specialization
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())
        );
      }

      // Filter by location
      if (locationQuery) {
        filtered = filtered.filter((doctor) =>
          doctor.location?.toLowerCase().includes(locationQuery.toLowerCase())
        );
      }

      // Filter by selected specializations
      if (selectedSpecializations.length > 0) {
        filtered = filtered.filter(
          (doctor) =>
            doctor.specialization &&
            selectedSpecializations.includes(doctor.specialization)
        );
      }

      // Filter by rating range
      filtered = filtered.filter(
        (doctor) =>
          doctor.rating >= ratingRange[0] && doctor.rating <= ratingRange[1]
      );

      // Filter by experience range
      filtered = filtered.filter(
        (doctor) =>
          !doctor.years_of_experience ||
          (doctor.years_of_experience >= experienceRange[0] &&
            doctor.years_of_experience <= experienceRange[1])
      );

      // Filter by verification status
      if (availabilityFilter.includes("verified")) {
        filtered = filtered.filter((doctor) => doctor.is_verified);
      }

      // Filter by availability
      const timeFilters = availabilityFilter.filter((f) =>
        ["morning", "afternoon", "evening", "full-day"].includes(f)
      );

      if (timeFilters.length > 0) {
        filtered = filtered.filter(
          (doctor) =>
            doctor.availability && timeFilters.includes(doctor.availability)
        );
      }

      setFilteredDoctors(filtered);
    };

    filterDoctors();
  }, [
    doctors,
    searchQuery,
    locationQuery,
    selectedSpecializations,
    ratingRange,
    experienceRange,
    availabilityFilter,
  ]);

  // Generate search suggestions as user types
  useEffect(() => {
    if (searchQuery.length > 1) {
      const nameMatches = doctors
        .filter((d) =>
          d.full_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((d) => d.full_name);

      const specializationMatches = doctors
        .filter(
          (d) =>
            d.specialization &&
            d.specialization.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((d) => d.specialization);

      const uniqueSuggestions = Array.from(
        new Set([...nameMatches, ...specializationMatches])
      );
      setSuggestions(uniqueSuggestions.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, doctors]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocationQuery(event.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    const isName = doctors.some((d) => d.full_name === suggestion);

    if (isName) {
      setSearchQuery(suggestion);
    } else {
      setSelectedSpecializations([suggestion]);
      setSearchQuery(suggestion);
    }

    setSuggestions([]);
  };

  const toggleSpecialization = (specialization) => {
    setSelectedSpecializations((prev) =>
      prev.includes(specialization)
        ? prev.filter((s) => s !== specialization)
        : [...prev, specialization]
    );
  };

  const toggleAvailabilityFilter = (filter) => {
    setAvailabilityFilter((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setLocationQuery("");
    setSelectedSpecializations([]);
    setRatingRange([0, 5]);
    setExperienceRange([0, 30]);
    setAvailabilityFilter([]);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleDoctorSelection = (doctor) => {
    setSelectedDoctorId(doctor.id);
    setSelectedDoctor(doctor);
    onDoctorSelect(doctor.id);
    setBookingOpen(true);
  };

  const handleBookingSubmit = (data) => {
    toast({
      title: "Booking Submitted",
      description: `Your appointment with ${selectedDoctor?.full_name} is being processed.`,
    });
    setBookingOpen(false);
  };

  const BookingDialog = isMobile ? (
    <Sheet open={bookingOpen} onOpenChange={setBookingOpen}>
      <SheetContent className="md:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle>
            Book Appointment with {selectedDoctor?.full_name}
          </SheetTitle>
          <SheetDescription>
            Please select a convenient time slot for your consultation.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Select date and time</h3>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred schedule
                </p>
              </div>
            </div>

            <TimeSlotPicker
              selectedTime={selectedTime}
              onTimeSelect={setSelectedTime}
            />
          </div>

          <ConsultationForm onSubmit={handleBookingSubmit} />
        </div>
      </SheetContent>
    </Sheet>
  ) : (
    <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Book Appointment with {selectedDoctor?.full_name}
          </DialogTitle>
          <DialogDescription>
            Please select a convenient time slot for your consultation.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 mt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <TimeSlotPicker
              selectedTime={selectedTime}
              onTimeSelect={setSelectedTime}
            />

            <ConsultationForm onSubmit={handleBookingSubmit} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const FilterPanel = isMobile ? (
    <Sheet open={isFiltersPanelOpen} onOpenChange={setIsFiltersPanelOpen}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Doctors</SheetTitle>
          <SheetDescription>Refine your search results</SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">Specialization</h3>
            <div className="grid grid-cols-2 gap-2">
              {specializations.map((specialization) => (
                <div
                  key={specialization}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={`spec-${specialization}`}
                    checked={selectedSpecializations.includes(specialization)}
                    onCheckedChange={() => toggleSpecialization(specialization)}
                  />
                  <Label htmlFor={`spec-${specialization}`} className="text-sm">
                    {specialization}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Availability</h3>
            <div className="space-y-2">
              {["verified", "morning", "afternoon", "evening", "full-day"].map(
                (filter) => (
                  <div key={filter} className="flex items-center space-x-2">
                    <Checkbox
                      id={`avail-${filter}`}
                      checked={availabilityFilter.includes(filter)}
                      onCheckedChange={() => toggleAvailabilityFilter(filter)}
                    />
                    <Label
                      htmlFor={`avail-${filter}`}
                      className="text-sm capitalize"
                    >
                      {filter === "verified" ? "Verified Doctors Only" : filter}
                    </Label>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Doctor Rating</h3>
            <Slider
              value={ratingRange}
              min={0}
              max={5}
              step={0.5}
              onValueChange={setRatingRange}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{ratingRange[0]}</span>
              <span>{ratingRange[1]}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Years of Experience</h3>
            <Slider
              value={experienceRange}
              min={0}
              max={30}
              step={1}
              onValueChange={setExperienceRange}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{experienceRange[0]} years</span>
              <span>{experienceRange[1]} years</span>
            </div>
          </div>

          <Button variant="outline" onClick={clearFilters} className="w-full">
            Clear All Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  ) : (
    <Popover open={isFiltersPanelOpen} onOpenChange={setIsFiltersPanelOpen}>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 px-2 text-xs"
            >
              Clear All
            </Button>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Specialization</h4>
            <div className="grid grid-cols-2 gap-2">
              {specializations.slice(0, 6).map((specialization) => (
                <div
                  key={specialization}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={`spec-pop-${specialization}`}
                    checked={selectedSpecializations.includes(specialization)}
                    onCheckedChange={() => toggleSpecialization(specialization)}
                  />
                  <Label
                    htmlFor={`spec-pop-${specialization}`}
                    className="text-xs"
                  >
                    {specialization}
                  </Label>
                </div>
              ))}
            </div>
            {specializations.length > 6 && (
              <Button variant="link" size="sm" className="h-6 p-0 text-xs">
                Show more...
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Availability</h4>
            <div className="grid grid-cols-2 gap-2">
              {["verified", "morning", "afternoon", "evening"].map((filter) => (
                <div key={filter} className="flex items-center space-x-2">
                  <Checkbox
                    id={`avail-pop-${filter}`}
                    checked={availabilityFilter.includes(filter)}
                    onCheckedChange={() => toggleAvailabilityFilter(filter)}
                  />
                  <Label
                    htmlFor={`avail-pop-${filter}`}
                    className="text-xs capitalize"
                  >
                    {filter === "verified" ? "Verified Only" : filter}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <h4 className="text-sm font-medium">Rating</h4>
              <span className="text-xs text-muted-foreground">
                {ratingRange[0]}-{ratingRange[1]}
              </span>
            </div>
            <Slider
              value={ratingRange}
              min={0}
              max={5}
              step={0.5}
              onValueChange={setRatingRange}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <h4 className="text-sm font-medium">Experience (years)</h4>
              <span className="text-xs text-muted-foreground">
                {experienceRange[0]}-{experienceRange[1]}
              </span>
            </div>
            <Slider
              value={experienceRange}
              min={0}
              max={30}
              step={1}
              onValueChange={setExperienceRange}
              className="w-full"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            placeholder="Search doctors by name or specialty"
            className="pl-9 pr-4"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border max-h-60 overflow-auto">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion}
                  className="px-4 py-2 hover:bg-muted cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Location (City, Hospital)"
              className="pl-9"
              value={locationQuery}
              onChange={handleLocationChange}
            />
          </div>

          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex-1 sm:flex-none sm:w-auto justify-between"
              onClick={() => setIsFiltersPanelOpen(true)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
        </div>

        {/* Active filters display */}
        {(selectedSpecializations.length > 0 ||
          availabilityFilter.length > 0) && (
          <div className="flex flex-wrap gap-2">
            {selectedSpecializations.map((spec) => (
              <Badge
                key={`filter-${spec}`}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {spec}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => toggleSpecialization(spec)}
                />
              </Badge>
            ))}

            {availabilityFilter.map((filter) => (
              <Badge
                key={`avail-${filter}`}
                variant="outline"
                className="flex items-center gap-1"
              >
                {filter === "verified" ? "Verified Only" : filter}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => toggleAvailabilityFilter(filter)}
                />
              </Badge>
            ))}

            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 px-2 text-xs"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>

      {FilterPanel}

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 rounded bg-gray-200" />
                    <div className="h-3 w-1/2 rounded bg-gray-200" />
                    <div className="h-3 w-1/4 rounded bg-gray-200" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {filteredDoctors.length}{" "}
              {filteredDoctors.length === 1 ? "doctor" : "doctors"} found
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Sort By <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort doctors by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Highest Rated
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>
                  Most Reviews
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Name (A-Z)</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>
                  Experience (High to Low)
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDoctors.length === 0 ? (
              <div className="md:col-span-2 lg:col-span-3 text-center py-8 text-muted-foreground">
                No doctors found matching your criteria. Try adjusting your
                filters.
              </div>
            ) : (
              filteredDoctors.map((doctor) => (
                <Card
                  key={doctor.id}
                  className={cn(
                    "overflow-hidden transition-colors",
                    selectedDoctorId === doctor.id ? "ring-2 ring-primary" : ""
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col h-full">
                      <div className="flex items-start gap-4">
                        <img
                          src={
                            doctor.avatar_url ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              doctor.full_name
                            )}&background=random`
                          }
                          alt={doctor.full_name}
                          className="h-16 w-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">
                                {doctor.full_name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {doctor.specialization ||
                                  "General Practitioner"}
                              </p>
                            </div>
                            {doctor.is_verified && (
                              <Badge variant="outline" className="bg-accent">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                              <span className="text-sm ml-1 font-medium">
                                {doctor.rating.toFixed(1)}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              ({doctor.total_reviews} reviews)
                            </span>
                          </div>
                          {doctor.years_of_experience && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {doctor.years_of_experience} years experience
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-3">
                        {doctor.available_days?.map((day) => (
                          <Badge
                            key={day}
                            variant="outline"
                            className="text-xs"
                          >
                            {day}
                          </Badge>
                        ))}
                        {doctor.availability && (
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {doctor.availability}
                          </Badge>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t flex gap-2 justify-between">
                        <Button
                          size="sm"
                          onClick={() => handleDoctorSelection(doctor)}
                          variant={
                            selectedDoctorId === doctor.id
                              ? "default"
                              : "outline"
                          }
                          className="flex-1"
                        >
                          {selectedDoctorId === doctor.id
                            ? "Selected"
                            : "Book Appointment"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setSelectedDoctor(doctor);
                            setBookingOpen(true);
                          }}
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </>
      )}

      {BookingDialog}
    </div>
  );
}
