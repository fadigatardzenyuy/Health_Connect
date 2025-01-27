import { useState, ChangeEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Brain, Loader2, Mic } from "lucide-react";
import { analyzeSymptoms } from "@/utils/aiService";
import { ScrollArea } from "@/components/ui/scroll-area";

export function SymptomChecker() {
  const [symptoms, setSymptoms] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  const handleSymptomChange = (e) => {
    setSymptoms(e.target.value);
  };

  const startVoiceInput = async () => {
    try {
      const recognition = new (window.webkitSpeechRecognition ||
        window.SpeechRecognition)();
      recognition.lang = "en-US";
      recognition.continuous = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");
        setSymptoms((prev) => prev + " " + transcript);
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

  const analyzeUserSymptoms = async () => {
    if (!symptoms.trim()) {
      toast({
        title: "Please enter your symptoms",
        description: "Describe your symptoms to receive an analysis",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeSymptoms(symptoms);
      setAnalysis(result);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">AI Symptom Checker</h3>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={startVoiceInput}
            disabled={isListening}
          >
            <Mic className={`w-4 h-4 ${isListening ? "text-red-500" : ""}`} />
          </Button>
        </div>

        <Textarea
          placeholder="Describe your symptoms in detail..."
          value={symptoms}
          onChange={handleSymptomChange}
          className="min-h-[100px]"
        />

        <Button
          onClick={analyzeUserSymptoms}
          disabled={isAnalyzing}
          className="w-full"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze Symptoms"
          )}
        </Button>

        {analysis && (
          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
            <div className="whitespace-pre-wrap">{analysis}</div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
