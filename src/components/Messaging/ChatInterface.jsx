import { useState, useRef } from "react";
import {
  Send,
  Mic,
  Paperclip,
  Image,
  StopCircle,
  Play,
  Pause,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(null);
  const { toast } = useToast();
  const audioRef = useRef(null);
  const chunksRef = useRef([]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      sender: "user",
      content: newMessage,
      timestamp: new Date(),
      status: "sent",
      type: "text",
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    toast({
      title: "Message sent",
      description: "Your message has been sent successfully.",
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      audioRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);

        const message = {
          id: Date.now().toString(),
          sender: "user",
          content: audioUrl,
          timestamp: new Date(),
          status: "sent",
          type: "voice",
        };

        setMessages((prev) => [...prev, message]);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      toast({
        title: "Recording started",
        description: "Voice recording has begun.",
      });
    } catch (error) {
      toast({
        title: "Recording failed",
        description: "Could not access microphone.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (audioRef.current && isRecording) {
      audioRef.current.stop();
      setIsRecording(false);
      toast({
        title: "Recording stopped",
        description: "Voice message has been recorded.",
      });
    }
  };

  const handleRecordVoice = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const handleAttachment = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "*/*";
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const fileUrl = URL.createObjectURL(file);
        const message = {
          id: Date.now().toString(),
          sender: "user",
          content: fileUrl,
          timestamp: new Date(),
          status: "sent",
          type: "file",
          fileName: file.name,
        };

        setMessages((prev) => [...prev, message]);
        toast({
          title: "File attached",
          description: `${file.name} has been attached to your message.`,
        });
      }
    };
    input.click();
  };

  const togglePlayVoiceMessage = (messageId) => {
    setIsPlaying((current) => (current === messageId ? null : messageId));
  };

  return (
    <Card className="w-full max-w-3xl mx-auto h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Messages</CardTitle>
      </CardHeader>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {message.type === "text" && <p>{message.content}</p>}
                {message.type === "voice" && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => togglePlayVoiceMessage(message.id)}
                      className="h-8 w-8"
                    >
                      {isPlaying === message.id ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <audio src={message.content} controls={false} />
                    <span className="text-xs">Voice message</span>
                  </div>
                )}
                {message.type === "file" && (
                  <div className="flex items-center gap-2">
                    <Paperclip className="h-4 w-4" />
                    <a
                      href={message.content}
                      download={message.fileName}
                      className="text-sm underline"
                    >
                      {message.fileName}
                    </a>
                  </div>
                )}
                <div className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                  {message.status === "read" && " ✓✓"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <CardContent className="border-t p-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleAttachment}
            className="shrink-0"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleAttachment}
            className="shrink-0"
          >
            <Image className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRecordVoice}
            className={`shrink-0 ${isRecording ? "text-red-500" : ""}`}
          >
            {isRecording ? (
              <StopCircle className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>
          <Button onClick={handleSendMessage} className="shrink-0">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
