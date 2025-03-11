import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { VideoPreview } from "./consultation/VideoPreview";
import { ConsultationForm } from "./consultation/ConsultationForm";
import { TimeSlotPicker } from "./consultation/TimeSlotPicker";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  AlertCircle,
  CreditCard,
  Check,
  Calendar as CalendarIcon,
  Clock,
  User,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import { DoctorSearch } from "./DoctorSearch";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ConsultationBooking() {
  const [selectedDate, setSelectedDate] = useState();
  const [selectedTime, setSelectedTime] = useState();
  const [selectedDoctor, setSelectedDoctor] = useState();
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [consultationData, setConsultationData] = useState(null);
  const [bookingStep, setBookingStep] = useState(1);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedDoctor) {
      fetchDoctorDetails(selectedDoctor);
    }
  }, [selectedDoctor]);

  const fetchDoctorDetails = async (doctorId) => {
    try {
      // First get the doctor's profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select(
          "id, full_name, specialization, avatar_url, rating, total_reviews"
        )
        .eq("id", doctorId)
        .single();

      if (profileError) throw profileError;

      // Then get the doctor's fee from doctor_profiles
      const { data: feeData, error: feeError } = await supabase
        .from("doctor_profiles")
        .select("consultation_fee, experience_years, languages")
        .eq("user_id", doctorId)
        .single();

      if (feeError) {
        console.error("Error fetching consultation fee:", feeError);
        // Still proceed with default fee if doctor_profile not found
        setDoctorDetails({
          id: profileData.id,
          full_name: profileData.full_name,
          specialization: profileData.specialization || "General Practitioner",
          avatar_url: profileData.avatar_url,
          consultation_fee: 50, // Default fee
          rating: profileData.rating || 0,
          total_reviews: profileData.total_reviews || 0,
        });
        return;
      }

      setDoctorDetails({
        id: profileData.id,
        full_name: profileData.full_name,
        specialization: profileData.specialization || "General Practitioner",
        avatar_url: profileData.avatar_url,
        consultation_fee: feeData?.consultation_fee || 50,
        rating: profileData.rating || 0,
        total_reviews: profileData.total_reviews || 0,
        experience_years: feeData?.experience_years,
        languages: feeData?.languages,
      });
    } catch (error) {
      console.error("Error fetching doctor details:", error);
      toast({
        title: "Error",
        description: "Failed to load doctor details",
        variant: "destructive",
      });
    }
  };

  const handleBooking = (data) => {
    if (!selectedDate || !selectedTime || !selectedDoctor || !user) {
      toast({
        title: "Incomplete Booking",
        description:
          "Please select a doctor, date, and time for your consultation.",
        variant: "destructive",
      });
      return;
    }

    // Store the consultation data for use after payment
    setConsultationData(data);

    // Open payment dialog
    setIsPaymentDialogOpen(true);
  };

  const handlePaymentConfirm = async () => {
    if (
      !consultationData ||
      !selectedDate ||
      !selectedTime ||
      !selectedDoctor ||
      !user
    )
      return;

    setIsProcessingPayment(true);

    try {
      // In a real app, you would integrate with a payment provider here
      // For now, we simulate a payment process with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create the appointment with payment status "paid"
      const { error } = await supabase.from("appointments").insert({
        patient_id: user.id,
        doctor_id: selectedDoctor,
        symptoms: consultationData.symptoms,
        medical_history: consultationData.medicalHistory,
        allergies: consultationData.allergies || null,
        current_medications: consultationData.currentMedications || null,
        appointment_date: selectedDate.toISOString().split("T")[0],
        appointment_time: selectedTime,
        status: "pending",
        payment_status: "paid",
        visit_reason: consultationData.visitReason,
        height: consultationData.height || null,
        weight: consultationData.weight || null,
        blood_pressure: consultationData.bloodPressure || null,
        smoker: consultationData.smoker || null,
        alcohol_consumption: consultationData.alcoholConsumption || null,
        chronic_conditions: consultationData.chronicConditions || null,
        previous_treatments: consultationData.previousTreatments || null,
      });

      if (error) throw error;

      toast({
        title: "Booking Successful",
        description: "Your consultation has been booked and payment processed",
        variant: "default",
      });

      setIsPaymentDialogOpen(false);

      // Navigate to dashboard after successful booking
      navigate("/dashboard");
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        title: "Payment Failed",
        description:
          "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleDoctorSelect = (doctorId) => {
    setSelectedDoctor(doctorId);
    // Move to step 2 when a doctor is selected
    setBookingStep(2);
  };

  const getProgressValue = () => {
    if (!selectedDoctor) return 25;
    if (!selectedDate || !selectedTime) return 50;
    if (!consultationData) return 75;
    return 100;
  };

  if (!user) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center space-y-4 py-10">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <h2 className="text-xl font-semibold">Authentication Required</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Please sign in to book a consultation with our verified medical
            professionals
          </p>
          <Button
            onClick={() => navigate("/signin")}
            size="lg"
            className="mt-4"
          >
            Sign In to Continue
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Progressive steps display */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium">Booking Progress</p>
                <p className="text-sm text-muted-foreground">
                  {bookingStep === 1 && "Step 1: Select a doctor"}
                  {bookingStep === 2 && "Step 2: Choose date and time"}
                  {bookingStep === 3 && "Step 3: Complete medical information"}
                </p>
              </div>
              <Badge
                variant={getProgressValue() === 100 ? "default" : "outline"}
                className="ml-2"
              >
                {getProgressValue()}% Complete
              </Badge>
            </div>
            <Progress value={getProgressValue()} className="h-2" />

            <div className="flex justify-between pt-2">
              <div
                className={`flex flex-col items-center ${
                  bookingStep >= 1 ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    bookingStep >= 1 ? "bg-primary text-white" : "bg-muted"
                  }`}
                >
                  1
                </div>
                <span className="text-xs mt-1">Doctor</span>
              </div>
              <div
                className={`flex flex-col items-center ${
                  bookingStep >= 2 ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    bookingStep >= 2 ? "bg-primary text-white" : "bg-muted"
                  }`}
                >
                  2
                </div>
                <span className="text-xs mt-1">Schedule</span>
              </div>
              <div
                className={`flex flex-col items-center ${
                  bookingStep >= 3 ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    bookingStep >= 3 ? "bg-primary text-white" : "bg-muted"
                  }`}
                >
                  3
                </div>
                <span className="text-xs mt-1">Details</span>
              </div>
              <div
                className={`flex flex-col items-center ${
                  consultationData ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    consultationData ? "bg-primary text-white" : "bg-muted"
                  }`}
                >
                  4
                </div>
                <span className="text-xs mt-1">Payment</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {bookingStep === 1 && (
        <Card className="bg-white shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">
              Find Available Doctors
            </CardTitle>
            <CardDescription>
              Search for doctors by name, specialty or location and select one
              to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DoctorSearch onDoctorSelect={handleDoctorSelect} />
          </CardContent>
        </Card>
      )}

      {bookingStep >= 2 && selectedDoctor && doctorDetails && (
        <Card className="bg-white shadow-lg mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold text-primary mb-1">
                  Book Your Consultation
                </CardTitle>
                <CardDescription>
                  With Dr. {doctorDetails.full_name},{" "}
                  {doctorDetails.specialization}
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
              >
                <CreditCard className="h-3.5 w-3.5" />$
                {doctorDetails.consultation_fee}
              </Badge>
            </div>

            <div className="mt-4 flex items-center gap-3 p-4 bg-primary/5 rounded-lg">
              <Avatar className="h-16 w-16 border-2 border-primary/10">
                <AvatarImage src={doctorDetails.avatar_url} />
                <AvatarFallback>
                  {doctorDetails.full_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-lg">
                  Dr. {doctorDetails.full_name}
                </h3>
                <p className="text-muted-foreground">
                  {doctorDetails.specialization}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-sm font-medium">
                      {doctorDetails.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({doctorDetails.total_reviews} reviews)
                  </span>
                  {doctorDetails.experience_years && (
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                      {doctorDetails.experience_years}+ years exp.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs
              defaultValue={bookingStep === 2 ? "schedule" : "medical"}
              onValueChange={(value) => {
                if (value === "schedule") setBookingStep(2);
                else if (value === "medical") setBookingStep(3);
              }}
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="schedule" disabled={bookingStep < 2}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Date & Time
                </TabsTrigger>
                <TabsTrigger
                  value="medical"
                  disabled={bookingStep < 3 || !selectedDate || !selectedTime}
                >
                  <User className="mr-2 h-4 w-4" />
                  Medical Information
                </TabsTrigger>
              </TabsList>

              <TabsContent value="schedule" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <VideoPreview />
                    <TimeSlotPicker
                      onTimeSelect={(time) => {
                        setSelectedTime(time);
                        if (selectedDate) {
                          setBookingStep(3);
                        }
                      }}
                      selectedTime={selectedTime}
                    />
                  </div>
                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <CalendarIcon className="h-5 w-5 text-primary" />
                          Select Appointment Date
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            if (selectedTime) {
                              setBookingStep(3);
                            }
                          }}
                          className="rounded-md border mx-auto pointer-events-auto"
                          disabled={(date) =>
                            date < new Date() ||
                            date >
                              new Date(
                                new Date().setDate(new Date().getDate() + 30)
                              )
                          }
                        />

                        <div className="mt-4 pt-3 border-t">
                          <div className="flex gap-1 items-center text-sm text-muted-foreground">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            <span>
                              Appointments are available up to 30 days in
                              advance
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Doctor availability summary */}
                    {selectedDate && (
                      <Card className="bg-blue-50 border-blue-100">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg text-blue-800">
                            Dr. {doctorDetails.full_name}'s Availability
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-blue-700">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>
                                Available on{" "}
                                {selectedDate &&
                                  format(selectedDate, "EEEE, MMMM d, yyyy")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>Video consultation from anywhere</span>
                            </div>
                            {doctorDetails.languages && (
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>
                                  Languages:{" "}
                                  {doctorDetails.languages.join(", ")}
                                </span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <Button
                    onClick={() => {
                      if (selectedDate && selectedTime) {
                        setBookingStep(3);
                      } else {
                        toast({
                          title: "Select Date and Time",
                          description:
                            "Please select both a date and time to continue",
                          variant: "default",
                        });
                      }
                    }}
                    size="lg"
                    disabled={!selectedDate || !selectedTime}
                    className="w-full md:w-auto"
                  >
                    Continue to Medical Information
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="medical">
                <div className="mb-6">
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Your medical information is encrypted and will only be
                          shared with Dr. {doctorDetails.full_name} upon
                          confirmation of your booking
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <ConsultationForm onSubmit={handleBooking} />
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="bg-gray-50 border-t px-6 py-4">
            <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Consultation Fee:
                </p>
                <p className="text-lg font-semibold">
                  ${doctorDetails.consultation_fee}
                </p>
              </div>

              {bookingStep === 2 && (
                <Button
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => {
                    if (selectedDate && selectedTime) {
                      setBookingStep(3);
                    }
                  }}
                  className="w-full md:w-auto gap-2"
                >
                  <User className="h-4 w-4" />
                  Continue to Medical Information
                </Button>
              )}

              {bookingStep === 3 && (
                <Button
                  onClick={() =>
                    document.getElementById("consultation-form-submit")?.click()
                  }
                  className="w-full md:w-auto gap-2"
                >
                  <CreditCard className="h-4 w-4" />
                  Proceed to Payment
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      )}

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Payment</DialogTitle>
            <DialogDescription>
              Please confirm your payment to book your consultation
            </DialogDescription>
          </DialogHeader>

          {doctorDetails && selectedDate && selectedTime && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-green-50 border border-green-100 rounded-lg mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-800">
                      Almost There!
                    </h3>
                    <p className="text-sm text-green-700">
                      One final step to confirm your appointment
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pb-2 border-b">
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={doctorDetails.avatar_url} />
                    <AvatarFallback>
                      {doctorDetails.full_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Dr. {doctorDetails.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {doctorDetails.specialization}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">
                    {format(selectedDate, "EEEE, MMMM d, yyyy")}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Appointment Type:
                  </span>
                  <span className="font-medium">Video Consultation</span>
                </div>

                <Separator className="my-2" />

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Consultation Fee:
                  </span>
                  <span className="font-medium">
                    ${doctorDetails.consultation_fee}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform Fee:</span>
                  <span className="font-medium">$0.00</span>
                </div>

                <div className="flex justify-between text-sm font-medium pt-2 border-t">
                  <span>Total:</span>
                  <span className="text-primary">
                    ${doctorDetails.consultation_fee}
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  This is a simulated payment for demonstration purposes.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPaymentDialogOpen(false)}
              disabled={isProcessingPayment}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePaymentConfirm}
              disabled={isProcessingPayment}
              className="gap-2"
            >
              {isProcessingPayment ? (
                <>Processing...</>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  Confirm Payment (${doctorDetails?.consultation_fee})
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
