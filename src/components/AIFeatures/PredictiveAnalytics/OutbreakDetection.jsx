import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function OutbreakDetection() {
  const [isLoading, setIsLoading] = useState(false);
  const [outbreaks, setOutbreaks] = useState([]);
  const { toast } = useToast();

  const detectOutbreaks = async () => {
    setIsLoading(true);
    try {
      // Simulated API call - replace with actual data
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const mockData = [
        {
          disease: "Influenza A",
          location: "Douala",
          riskLevel: "High",
          cases: 245,
        },
        {
          disease: "Malaria",
          location: "Yaoundé",
          riskLevel: "Medium",
          cases: 156,
        },
        {
          disease: "Dengue Fever",
          location: "Bamenda",
          riskLevel: "Low",
          cases: 32,
        },
      ];
      setOutbreaks(mockData);

      toast({
        title: "Analysis Complete",
        description: "Disease outbreak data has been updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch outbreak data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case "High":
        return "text-red-500";
      case "Medium":
        return "text-yellow-500";
      case "Low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">
              Disease Outbreak Detection
            </h3>
          </div>
          <Button
            onClick={detectOutbreaks}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Patterns"
            )}
          </Button>
        </div>

        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          {outbreaks.map((outbreak, index) => (
            <div
              key={index}
              className="mb-4 p-4 bg-background rounded-lg border last:mb-0"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{outbreak.disease}</h4>
                <span
                  className={`font-medium ${getRiskColor(outbreak.riskLevel)}`}
                >
                  {outbreak.riskLevel} Risk
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>{outbreak.location}</span>
              </div>
              <div className="mt-2 text-sm">
                <span className="font-medium">{outbreak.cases}</span> cases
                detected
              </div>
            </div>
          ))}

          {outbreaks.length === 0 && !isLoading && (
            <div className="text-center text-gray-500 py-8">
              Click "Analyze Patterns" to detect potential disease outbreaks
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
