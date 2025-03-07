import { Search, MapPin, Filter, Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
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
import { ConsultationForm } from "./consultation/ConsultationForm";
import { TimeSlotPicker } from "./consultation/TimeSlotPicker";

export function DoctorSearch({ onDoctorSelect }) {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [filters, setFilters] = useState({
    verifiedOnly: false,
    minRating: false,
    hasReviews: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [searchQuery, locationQuery, filters]);

  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from("profiles")
        .select("*")
        .eq("role", "doctor")
        .order("rating", { ascending: false })
        .order("total_reviews", { ascending: false });

      if (searchQuery) {
        query = query.or(
          `full_name.ilike.%${searchQuery}%,specialization.ilike.%${searchQuery}%`
        );
      }

      if (filters.verifiedOnly) {
        query = query.eq("is_verified", true);
      }

      if (filters.minRating) {
        query = query.gte("rating", 4.0);
      }

      if (filters.hasReviews) {
        query = query.gt("total_reviews", 0);
      }

      if (locationQuery) {
        query = query.ilike("location", `%${locationQuery}%`);
      }

      const { data, error } = await query.limit(10);

      if (error) throw error;

      setDoctors(data || []);
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocationQuery(event.target.value);
  };

  const toggleFilter = (key) => {
    setFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
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
          <TimeSlotPicker
            selectedTime={selectedTime}
            onTimeSelect={setSelectedTime}
          />
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search doctors by name or specialty"
            className="pl-9"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Location (City, Hospital)"
            className="pl-9"
            value={locationQuery}
            onChange={handleLocationChange}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuCheckboxItem
              checked={filters.verifiedOnly}
              onCheckedChange={() => toggleFilter("verifiedOnly")}
            >
              Verified Doctors Only
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.minRating}
              onCheckedChange={() => toggleFilter("minRating")}
            >
              4+ Star Rating
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.hasReviews}
              onCheckedChange={() => toggleFilter("hasReviews")}
            >
              Has Reviews
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/4 rounded bg-gray-200" />
                    <div className="h-3 w-1/3 rounded bg-gray-200" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {doctors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No doctors found matching your criteria
            </div>
          ) : (
            doctors.map((doctor) => (
              <Card
                key={doctor.id}
                className={`overflow-hidden transition-colors hover:shadow-md ${
                  selectedDoctorId === doctor.id ? "ring-2 ring-primary" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        doctor.avatar_url ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          doctor.full_name
                        )}&background=random`
                      }
                      alt={doctor.full_name}
                      className="h-16 w-16 rounded-full object-cover border-2 border-primary/10"
                    />

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-lg">
                            {doctor.full_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {doctor.specialization || "General Practitioner"}
                          </p>
                        </div>
                        {doctor.is_verified && (
                          <Badge
                            variant="outline"
                            className="bg-accent text-xs"
                          >
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

                      {doctor.location && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{doctor.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleDoctorSelection(doctor)}
                        variant={
                          selectedDoctorId === doctor.id ? "default" : "outline"
                        }
                        className="w-full"
                      >
                        {selectedDoctorId === doctor.id
                          ? "Selected"
                          : "Book Appointment"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setSelectedDoctor(doctor);
                          toast({
                            title: "Doctor Profile",
                            description: `Viewing ${doctor.full_name}'s profile information`,
                          });
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
      )}

      {BookingDialog}
    </div>
  );
}
