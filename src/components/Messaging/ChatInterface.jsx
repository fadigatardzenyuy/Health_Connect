import { useState, useRef, useEffect } from "react";
import {
  Send,
  Mic,
  Paperclip,
  Image,
  StopCircle,
  Play,
  Pause,
  ArrowLeft,
  MoreVertical,
  Phone,
  Video,
  Smile,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";

export function ChatInterface({ friend, onBack }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(null);
  const { toast } = useToast();
  const audioRef = useRef(null);
  const chunksRef = useRef([]);
  const scrollAreaRef = useRef(null);
  const messageEndRef = useRef(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Load initial demo messages
  useEffect(() => {
    const initialMessages = [
      {
        id: "1",
        sender: "friend",
        content: `Hello, how can I help you today?`,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        status: "read",
        type: "text",
      },
      {
        id: "2",
        sender: "user",
        content: "Hi doctor, I've been having some headaches lately",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        status: "read",
        type: "text",
      },
      {
        id: "3",
        sender: "friend",
        content:
          "I'm sorry to hear that. How long have you been experiencing these headaches?",
        timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
        status: "read",
        type: "text",
      },
    ];

    setMessages(initialMessages);
  }, [friend.id]);

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

    // Simulate the friend's reply after a short delay
    setTimeout(() => {
      const reply = {
        id: (Date.now() + 1).toString(),
        sender: "friend",
        content:
          "I've noted your symptoms. Would you like to schedule a video consultation to discuss this further?",
        timestamp: new Date(),
        status: "sent",
        type: "text",
      };

      setMessages((prev) => [...prev, reply]);
    }, 3000);
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

  const getFormattedTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSocialIcon = (platform) => {
    switch (platform) {
      case "facebook":
        return <Facebook className="h-4 w-4" />;
      case "twitter":
        return <Twitter className="h-4 w-4" />;
      case "instagram":
        return <Instagram className="h-4 w-4" />;
      case "linkedin":
        return <Linkedin className="h-4 w-4" />;
      case "website":
        return <Globe className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-2 bg-[#f0f2f5] border-b">
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-[#54656f]"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-gray-200">
              <AvatarImage src={friend.avatar} alt={friend.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {friend.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-[#111b21]">{friend.name}</h3>
              <p className="text-xs text-[#667781]">
                {friend.online
                  ? "Online"
                  : friend.lastSeen
                  ? friend.lastSeen
                  : "Offline"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 text-[#54656f]">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Video className="h-5 w-5" />
          </Button>

          {/* Social Media Links Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-3" align="end">
              <div className="space-y-2">
                <h4 className="text-sm font-medium mb-2">
                  Connect with {friend.name.split(" ")[0]}
                </h4>

                {friend.socialLinks ? (
                  <div className="grid gap-2">
                    {Object.entries(friend.socialLinks).map(
                      ([platform, url]) =>
                        url && (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                          >
                            {getSocialIcon(platform)}
                            <span className="capitalize">{platform}</span>
                          </a>
                        )
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No social profiles available
                  </p>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea
        className="flex-1 bg-[#efeae2] p-4"
        viewportRef={scrollAreaRef}
      >
        <div className="space-y-2">
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
                  "max-w-[80%] md:max-w-[70%] rounded-lg p-2 shadow-sm relative",
                  message.sender === "user"
                    ? "bg-[#d9fdd3] text-[#111b21] rounded-tr-none"
                    : "bg-white text-[#111b21] rounded-tl-none"
                )}
              >
                {message.type === "text" && (
                  <p className="whitespace-pre-line text-sm">
                    {message.content}
                  </p>
                )}
                {message.type === "voice" && (
                  <div className="flex items-center gap-2 bg-gray-50 rounded p-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => togglePlayVoiceMessage(message.id)}
                      className="h-8 w-8 hover:bg-white/20 rounded-full"
                    >
                      {isPlaying === message.id ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <div className="h-2 flex-1 bg-gray-200 rounded-full">
                      <div className="h-full w-0 bg-blue-500 rounded-full"></div>
                    </div>
                    <span className="text-xs text-gray-500">0:00</span>
                  </div>
                )}
                {message.type === "file" && (
                  <div className="flex items-center gap-2 bg-gray-50 rounded p-2">
                    <Paperclip className="h-4 w-4 text-blue-500" />
                    <a
                      href={message.content}
                      download={message.fileName}
                      className="text-sm text-blue-600 underline hover:no-underline"
                    >
                      {message.fileName}
                    </a>
                  </div>
                )}
                <div className="text-[10px] text-right mt-1 mr-1 text-gray-500">
                  {getFormattedTime(message.timestamp)}
                  {message.sender === "user" && (
                    <span className="ml-1">
                      {message.status === "sent" && "✓"}
                      {message.status === "delivered" && "✓✓"}
                      {message.status === "read" && (
                        <span className="text-blue-500">✓✓</span>
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messageEndRef} /> {/* Element to scroll to */}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="bg-[#f0f2f5] p-2">
        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-[#54656f] rounded-full"
          >
            <Smile className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleAttachment}
            className="text-[#54656f] rounded-full"
          >
            <Paperclip className="h-5 w-5" />
          </Button>

          <Input
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 border-none focus:ring-0 py-2"
          />

          {newMessage ? (
            <Button
              onClick={handleSendMessage}
              variant="ghost"
              size="icon"
              className="text-[#54656f] rounded-full"
            >
              <Send className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRecordVoice}
              className={cn(
                "rounded-full",
                isRecording
                  ? "text-red-500 hover:text-red-600"
                  : "text-[#54656f]"
              )}
            >
              {isRecording ? (
                <StopCircle className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
