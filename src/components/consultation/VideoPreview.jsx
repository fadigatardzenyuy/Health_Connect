import { useState } from "react";
import { Camera, CameraOff, Mic, MicOff, Monitor, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    <Card className="bg-white shadow-sm rounded-xl overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-3 border-b">
          <h3 className="font-medium flex items-center">
            <Camera className="w-4 h-4 mr-2 text-primary" />
            Preview Your Video
          </h3>
        </div>
        <div className="p-4">
          <div className="bg-black rounded-lg mb-4 aspect-video relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              {isVideoOn ? (
                <div className="flex flex-col items-center">
                  <Avatar className="h-16 w-16 mb-2">
                    <AvatarImage src="/placeholder.svg" alt="User" />
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                  <div className="text-white text-sm bg-black/30 px-2 py-1 rounded">
                    You
                  </div>
                </div>
              ) : (
                <CameraOff className="w-12 h-12 text-gray-500" />
              )}
            </div>

            <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded text-white text-xs">
              Preview
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 bg-gray-50 p-2 rounded-lg">
            <Button
              variant={isVideoOn ? "secondary" : "destructive"}
              size="sm"
              onClick={toggleVideo}
              className={`flex-1 ${
                isVideoOn
                  ? "bg-primary/10 hover:bg-primary/20 text-primary"
                  : ""
              }`}
            >
              {isVideoOn ? (
                <Camera className="w-4 h-4 mr-2" />
              ) : (
                <CameraOff className="w-4 h-4 mr-2" />
              )}
              {isVideoOn ? "Camera On" : "Camera Off"}
            </Button>

            <Button
              variant={isAudioOn ? "secondary" : "destructive"}
              size="sm"
              onClick={toggleAudio}
              className={`flex-1 ${
                isAudioOn
                  ? "bg-primary/10 hover:bg-primary/20 text-primary"
                  : ""
              }`}
            >
              {isAudioOn ? (
                <Mic className="w-4 h-4 mr-2" />
              ) : (
                <MicOff className="w-4 h-4 mr-2" />
              )}
              {isAudioOn ? "Mic On" : "Mic Off"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
