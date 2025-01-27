import {
  Image,
  Video,
  Send,
  Phone,
  VideoIcon,
  Stethoscope,
  Pill,
  Activity,
  Users,
  Calendar,
  MessageSquare,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { DoctorSearch } from "./DoctorSearch";
import { SymptomChecker } from "./AIFeatures/SymptomChecker";
import { HealthAssistant } from "./AIFeatures/HealthAssistant";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { ConsultationBooking } from "./ConsultationBooking";

export function MainFeed() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleConsultation = (type) => {
    switch (type) {
      case "video":
        navigate("/video-consultation");
        break;
      case "audio":
        navigate("/audio-consultation");
        break;
      default:
        toast({
          title: "Coming Soon",
          description: "This feature will be available soon!",
          variant: "default",
        });
    }
  };

  return (
    <div className="col-span-6 space-y-6">
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="search">Find Doctor</TabsTrigger>
            <TabsTrigger value="post">Create Post</TabsTrigger>
            <TabsTrigger value="consultation">Book Consultation</TabsTrigger>
            <TabsTrigger value="ai">AI Assistant</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            <DoctorSearch />
          </TabsContent>

          <TabsContent value="post">
            <Textarea
              placeholder="Share your health journey or ask a question..."
              className="w-full mb-4 resize-none"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Image className="w-4 h-4 mr-2" />
                  Image
                </Button>
                <Button variant="outline" size="sm">
                  <Video className="w-4 h-4 mr-2" />
                  Video
                </Button>
              </div>
              <Button>
                <Send className="w-4 h-4 mr-2" />
                Post
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="consultation">
            <ConsultationBooking />
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <SymptomChecker />
            <HealthAssistant />
          </TabsContent>

          <TabsContent value="social">
            <div className="space-y-6">
              {/* Communities Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Health Communities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="cursor-pointer hover:bg-accent transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Users className="w-8 h-8 text-primary" />
                        <div>
                          <h4 className="font-medium">
                            Diabetes Support Group
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            1.2k members
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:bg-accent transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Users className="w-8 h-8 text-primary" />
                        <div>
                          <h4 className="font-medium">Mental Health Forum</h4>
                          <p className="text-sm text-muted-foreground">
                            3.5k members
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Events Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Upcoming Events</h3>
                <div className="grid grid-cols-1 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-8 h-8 text-primary" />
                        <div>
                          <h4 className="font-medium">
                            Wellness Webinar: Stress Management
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Tomorrow at 2:00 PM
                          </p>
                          <Button variant="outline" size="sm" className="mt-2">
                            Register Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Testimonials Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Recent Testimonials</h3>
                <div className="grid grid-cols-1 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Star className="w-6 h-6 text-yellow-500" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">Sarah M.</h4>
                            <span className="text-sm text-muted-foreground">
                              about Dr. Johnson
                            </span>
                          </div>
                          <p className="text-sm mt-1">
                            "Excellent care and attention to detail. Dr. Johnson
                            took the time to explain everything thoroughly."
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Discussion Forums */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Active Discussions</h3>
                <div className="grid grid-cols-1 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <MessageSquare className="w-6 h-6 text-primary" />
                        <div>
                          <h4 className="font-medium">
                            Tips for Managing Chronic Pain
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            32 replies • Last reply 2h ago
                          </p>
                          <Button variant="ghost" size="sm" className="mt-2">
                            Join Discussion
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <VideoIcon className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-medium">Upcoming Video Consultation</h3>
                  <p className="text-sm text-muted-foreground">
                    With Dr. Sarah Johnson - Tomorrow at 10:00 AM
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Pill className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-medium">Prescription Updated</h3>
                  <p className="text-sm text-muted-foreground">
                    New medication added by Dr. Mike Brown
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Activity className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-medium">Health Monitoring Alert</h3>
                  <p className="text-sm text-muted-foreground">
                    Blood pressure reading above normal
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
