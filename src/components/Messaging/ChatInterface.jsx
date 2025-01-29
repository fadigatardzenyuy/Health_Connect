import { useState, useRef } from "react";
import {
  Send,
  Mic,
  Paperclip,
  Image,
  StopCircle,
  Play,
  Pause,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function ChatInterface({ friend, onBack }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(null);
  const { toast } = useToast();
  const audioRef = useRef(null);
  const chunksRef = useRef([]);
  const scrollAreaRef = useRef(null);

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

    // Scroll to bottom after sending message
    setTimeout(() => {
      scrollAreaRef.current?.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
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
          duration: 0, // In a real app, you'd calculate this
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
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-white">
      {/* Chat Header */}
      <div className="flex items-center gap-4 p-4 border-b bg-white/80 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="md:hidden"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={friend.avatar}
              alt={friend.name}
              className="w-10 h-10 rounded-full"
            />
            {friend.online && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{friend.name}</h3>
            <p className="text-sm text-muted-foreground">
              {friend.online ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[70%] rounded-2xl p-3 shadow-sm",
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-gray-100 text-gray-900 rounded-bl-none"
                )}
              >
                {message.type === "text" && (
                  <p className="leading-relaxed">{message.content}</p>
                )}
                {message.type === "voice" && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => togglePlayVoiceMessage(message.id)}
                      className="h-8 w-8 hover:bg-white/20"
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
                      className="text-sm underline hover:no-underline"
                    >
                      {message.fileName}
                    </a>
                  </div>
                )}
                <div className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {message.status === "read" && " ✓✓"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleAttachment}
            className="shrink-0 text-muted-foreground hover:text-gray-900"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleAttachment}
            className="shrink-0 text-muted-foreground hover:text-gray-900"
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
            className={cn(
              "shrink-0",
              isRecording
                ? "text-red-500 hover:text-red-600"
                : "text-muted-foreground hover:text-gray-900"
            )}
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
      </div>
    </div>
  );
}
