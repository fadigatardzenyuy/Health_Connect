import { useState } from "react";
import { Camera, CameraOff, Mic, MicOff, Monitor, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export function VideoPreview() {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const { toast } = useToast();

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
    <Card className="w-full md:w-auto">
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
  );
}
