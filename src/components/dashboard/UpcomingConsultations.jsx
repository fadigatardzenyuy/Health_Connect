import {
  Calendar,
  Clock,
  User,
  Video,
  Phone,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export function UpcomingConsultations() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [consultations, setConsultations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConsultations = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);

        const today = new Date().toISOString().split("T")[0];

        const { data, error } = await supabase
          .from("appointments")
          .select(
            `
            id,
            patient_id,
            doctor_id,
            appointment_date,
            appointment_time,
            status,
            patient:profiles!patient_id(full_name)
          `
          )
          .eq("doctor_id", user.id)
          .eq("appointment_date", today)
          .order("appointment_time", { ascending: true });

        if (error) throw error;

        const formattedConsultations = (data || []).map((consult) => ({
          ...consult,
          type: Math.random() > 0.5 ? "video" : "audio",
          patient: consult.patient,
        }));

        setConsultations(formattedConsultations);
      } catch (error) {
        console.error("Error fetching consultations:", error);
        toast({
          title: "Failed to load consultations",
          description: "Could not retrieve today's consultations",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsultations();
  }, [user?.id, toast]);

  const handleStartConsultation = (type, id) => {
    toast({
      title: "Starting consultation",
      description: `Preparing ${type} consultation session...`,
    });

    if (type === "video") {
      navigate(`/video-consultation/${id}`);
    } else {
      navigate(`/audio-consultation/${id}`);
    }
  };

  return (
    <Card className="border border-gray-200 hover:border-gray-300 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Today's Consultations</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/consultation-booking")}
        >
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="p-4 border rounded-lg bg-card">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Skeleton className="h-8 w-28" />
                    <Skeleton className="h-8 w-36" />
                  </div>
                </div>
              ))
          ) : consultations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-medium mb-1">
                No consultations scheduled
              </h3>
              <p className="text-muted-foreground text-sm max-w-sm">
                You don't have any consultations scheduled for today. Your
                calendar is clear!
              </p>
            </div>
          ) : (
            consultations.map((consultation) => (
              <div
                key={consultation.id}
                className="p-4 border rounded-lg hover:bg-muted/10 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {consultation.patient?.full_name || "Patient"}
                      </h4>
                      <div className="flex items-center text-sm text-muted-foreground gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(
                            new Date(consultation.appointment_date),
                            "PP"
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {consultation.appointment_time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={
                      consultation.type === "video" ? "default" : "outline"
                    }
                  >
                    {consultation.type === "video" ? (
                      <span className="flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        Video
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        Audio
                      </span>
                    )}
                  </Badge>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate(`/appointment-details/${consultation.id}`)
                    }
                  >
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    onClick={() =>
                      handleStartConsultation(
                        consultation.type,
                        consultation.id
                      )
                    }
                  >
                    Start Consultation
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
