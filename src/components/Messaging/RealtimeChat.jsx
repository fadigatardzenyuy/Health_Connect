import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Paperclip,
  Image,
  Smile,
  Mic,
  Phone,
  Video,
  MoreVertical,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function RealtimeChat({
  recipientId,
  recipientName,
  recipientAvatar,
  recipientRole = "user",
  onCallStart,
}) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isRecipientTyping, setIsRecipientTyping] = useState(false);
  const [isUserOnline, setIsUserOnline] = useState(false);
  const messagesEndRef = useRef(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user?.id || !recipientId) return;

      try {
        setIsLoading(true);

        const dummyMessages = [
          {
            id: "1",
            sender_id: recipientId,
            content: "Hello, how can I help you today?",
            timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            read: true,
            sender: {
              full_name: recipientName,
              avatar_url: recipientAvatar,
            },
          },
          {
            id: "2",
            sender_id: user.id,
            content: "I have a question about my medication.",
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            read: true,
            sender: {
              full_name: user.name || "You",
              avatar_url: user.avatar_url,
            },
          },
          {
            id: "3",
            sender_id: recipientId,
            content: "Of course, what would you like to know?",
            timestamp: new Date(Date.now() - 1000 * 60 * 29).toISOString(),
            read: true,
            sender: {
              full_name: recipientName,
              avatar_url: recipientAvatar,
            },
          },
        ];

        setMessages(dummyMessages);
        setupRealtimeSubscription();
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setTimeout(() => {
          setIsUserOnline(true);
        }, 1000);
      }
    };

    fetchMessages();

    return () => {
      cleanupRealtimeSubscription();
    };
  }, [user?.id, recipientId, toast]);

  const setupRealtimeSubscription = () => {
    const typingInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsRecipientTyping(true);
        setTimeout(() => setIsRecipientTyping(false), 3000);
      }
    }, 10000);

    return typingInterval;
  };

  const cleanupRealtimeSubscription = () => {
    // Cleanup code for subscription
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isRecipientTyping]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (input.trim() === "" || isSending) return;

    try {
      setIsSending(true);

      const newMessage = {
        id: Date.now().toString(),
        sender_id: user?.id || "",
        content: input.trim(),
        timestamp: new Date().toISOString(),
        read: false,
        sender: {
          full_name: user?.name || "You",
          avatar_url: user?.avatar_url,
        },
      };

      setMessages((prev) => [...prev, newMessage]);
      setInput("");

      setTimeout(() => {
        setIsRecipientTyping(true);

        setTimeout(() => {
          const responseMessage = {
            id: (Date.now() + 1).toString(),
            sender_id: recipientId,
            content: getRandomResponse(),
            timestamp: new Date().toISOString(),
            read: false,
            sender: {
              full_name: recipientName,
              avatar_url: recipientAvatar,
            },
          };

          setIsRecipientTyping(false);
          setMessages((prev) => [...prev, responseMessage]);
        }, 3000);
      }, 1000);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const getRandomResponse = () => {
    const responses = [
      "I understand your concern. Let me check your records.",
      "That's a good question. It's important to take this medication exactly as prescribed.",
      "I'd recommend scheduling a follow-up appointment to discuss this further.",
      "Have you noticed any side effects?",
      "Your test results look normal, nothing to worry about.",
      "I'm glad to hear you're feeling better!",
      "Let me know if your symptoms persist or worsen.",
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const formatMessageDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return format(date, "h:mm a");
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday, " + format(date, "h:mm a");
    }

    if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return format(date, "EEEE, h:mm a");
    }

    return format(date, "MMM d, yyyy, h:mm a");
  };

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden">
      <div className="p-3 border-b bg-muted/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar>
              <AvatarImage src={recipientAvatar} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {recipientName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {isUserOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{recipientName}</h3>
              {recipientRole === "doctor" && (
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary text-xs"
                >
                  Doctor
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {isUserOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onCallStart && onCallStart("audio")}
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Audio call</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onCallStart && onCallStart("video")}
                >
                  <Video className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Video call</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="bottom" align="end" className="w-56">
              <div className="grid gap-1">
                <Button variant="ghost" size="sm" className="justify-start">
                  View profile
                </Button>
                <Button variant="ghost" size="sm" className="justify-start">
                  Search conversation
                </Button>
                <Button variant="ghost" size="sm" className="justify-start">
                  Mute notifications
                </Button>
                <Separator className="my-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start text-red-500 hover:text-red-500 hover:bg-red-50"
                >
                  Block user
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <ScrollArea className="flex-grow p-4" viewportRef={scrollRef}>
        <div className="flex flex-col gap-3">
          {isLoading ? (
            <div className="flex flex-col gap-4 p-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${i % 2 === 0 ? "self-end" : ""}`}
                >
                  {i % 2 !== 0 && (
                    <div className="w-8 h-8 rounded-full bg-gray-200" />
                  )}
                  <div
                    className={`animate-pulse rounded-2xl py-2 px-3 max-w-[80%] ${
                      i % 2 === 0 ? "bg-gray-200" : "bg-gray-100"
                    }`}
                    style={{ width: `${100 + Math.random() * 120}px` }}
                  >
                    <div className="h-2 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-2 bg-gray-300 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            messages.map((message, index) => {
              const isCurrentUser = message.sender_id === user?.id;
              const showAvatar =
                !isCurrentUser &&
                (!messages[index - 1] ||
                  messages[index - 1].sender_id !== message.sender_id);

              return (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isCurrentUser && showAvatar ? (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={message.sender?.avatar_url} />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {message.sender?.full_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ) : !isCurrentUser ? (
                    <div className="w-8 flex-shrink-0" />
                  ) : null}

                  <div className="flex flex-col">
                    <div
                      className={`py-2 px-3 rounded-2xl max-w-sm ${
                        isCurrentUser
                          ? "bg-primary text-white rounded-br-none"
                          : "bg-muted rounded-bl-none"
                      }`}
                    >
                      {message.content}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1 px-1">
                      {formatMessageDate(message.timestamp)}
                    </span>
                  </div>
                </div>
              );
            })
          )}

          {isRecipientTyping && (
            <div className="flex items-end gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={recipientAvatar} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {recipientName.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="py-2 px-3 rounded-2xl rounded-bl-none bg-muted">
                <div className="flex gap-1">
                  <span className="animate-bounce">●</span>
                  <span
                    className="animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  >
                    ●
                  </span>
                  <span
                    className="animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  >
                    ●
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-3 border-t">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Attach file</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Image className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Upload image</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Smile className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Add emoji</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 md:flex hidden"
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Voice message</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Input
            ref={inputRef}
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            className="flex-grow"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />

          <Button
            onClick={handleSendMessage}
            disabled={input.trim() === "" || isSending}
            size="icon"
            className="h-9 w-9"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
