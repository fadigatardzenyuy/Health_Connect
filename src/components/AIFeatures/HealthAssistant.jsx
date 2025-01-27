import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare, Languages, Loader2, Mic } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getDiagnosis, getTreatmentRecommendations } from "@/utils/aiService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function HealthAssistant() {
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("en");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([]);
  const { toast } = useToast();

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleLanguageChange = (value) => {
    setLanguage(value);
  };

  const startVoiceInput = async () => {
    try {
      const recognition = new (window.webkitSpeechRecognition ||
        window.SpeechRecognition)();
      recognition.lang = language === "fr" ? "fr-FR" : "en-US";
      recognition.continuous = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");
        setMessage((prev) => prev + " " + transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        toast({
          title: "Error",
          description: "Failed to start voice input. Please try again.",
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (error) {
      console.error("Speech recognition error:", error);
      toast({
        title: "Error",
        description: "Voice input is not supported in your browser.",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Please enter a message",
        description: "Type your health-related question to get assistance",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    const userMessage = message;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setMessage("");

    try {
      let response;
      if (userMessage.toLowerCase().includes("diagnos")) {
        response = await getDiagnosis(userMessage);
      } else if (userMessage.toLowerCase().includes("treatment")) {
        response = await getTreatmentRecommendations(userMessage);
      } else {
        response =
          "I understand your concern. Please provide more specific information about your symptoms or ask about a specific condition for diagnosis or treatment recommendations.";
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">Health Assistant</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={startVoiceInput}
              disabled={isListening}
            >
              <Mic className={`w-4 h-4 ${isListening ? "text-red-500" : ""}`} />
            </Button>
            <Languages className="w-4 h-4 text-muted-foreground" />
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="fu">Fulfulde</SelectItem>
                <SelectItem value="bam">Bamanankan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 ${
                msg.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            placeholder="Ask me anything about your health..."
            value={message}
            onChange={handleMessageChange}
          />
          <Button onClick={sendMessage} disabled={isProcessing}>
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Send"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
