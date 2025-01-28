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
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Monitor,
  X,
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
import { useState } from "react";

export function MainFeed() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

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

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    toast({
      title: isVideoOn ? "Video Off" : "Video On",
      description: `Your camera is now ${isVideoOn ? "disabled" : "enabled"}`,
    });
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    toast({
      title: isAudioOn ? "Audio Off" : "Audio On",
      description: `Your microphone is now ${isAudioOn ? "muted" : "unmuted"}`,
    });
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast({
      title: isScreenSharing
        ? "Screen Sharing Stopped"
        : "Screen Sharing Started",
      description: `Screen sharing is now ${
        isScreenSharing ? "disabled" : "enabled"
      }`,
    });
  };

  return (
    <div className="col-span-12 md:col-span-6 space-y-4">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 p-0">
            <TabsTrigger value="search">Find Doctor</TabsTrigger>
            <TabsTrigger value="post">Create Post</TabsTrigger>
            <TabsTrigger value="consultation" className="hidden md:block">
              Book Consultation
            </TabsTrigger>
            <TabsTrigger value="ai" className="hidden md:block">
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="social" className="hidden md:block">
              Social
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="p-4">
            <DoctorSearch />
          </TabsContent>

          <TabsContent value="post" className="p-4">
            <Textarea
              placeholder="Share your health journey or ask a question..."
              className="w-full mb-4 resize-none"
            />
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Image className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">Image</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Video className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">Video</span>
                </Button>
              </div>
              <Button className="flex items-center">
                <Send className="w-4 h-4 mr-2" />
                <span>Post</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="consultation" className="p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="relative">
                  <CardContent className="p-4">
                    <div className="bg-gray-100 aspect-video rounded-lg mb-4 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        {isVideoOn ? (
                          <Camera className="w-12 h-12 text-gray-400" />
                        ) : (
                          <CameraOff className="w-12 h-12 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant={isVideoOn ? "default" : "destructive"}
                        size="sm"
                        onClick={toggleVideo}
                      >
                        {isVideoOn ? (
                          <Camera className="w-4 h-4" />
                        ) : (
                          <CameraOff className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant={isAudioOn ? "default" : "destructive"}
                        size="sm"
                        onClick={toggleAudio}
                      >
                        {isAudioOn ? (
                          <Mic className="w-4 h-4" />
                        ) : (
                          <MicOff className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant={isScreenSharing ? "default" : "secondary"}
                        size="sm"
                        onClick={toggleScreenShare}
                      >
                        <Monitor className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <ConsultationBooking />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="p-4 space-y-6">
            <SymptomChecker />
            <HealthAssistant />
          </TabsContent>

          <TabsContent value="social" className="p-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Health Communities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="cursor-pointer hover:bg-accent transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Users className="w-8 h-8 text-primary" />
                      <div>
                        <h4 className="font-medium">Diabetes Support Group</h4>
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
          </TabsContent>
        </Tabs>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
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
  );
}
