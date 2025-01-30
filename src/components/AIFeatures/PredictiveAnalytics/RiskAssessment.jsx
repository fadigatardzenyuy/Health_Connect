import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { AlertTriangle, Activity, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function RiskAssessment() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [riskScore, setRiskScore] = useState(null);
  const { toast } = useToast();

  const calculateRiskScore = async () => {
    if (!age || !gender) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Simulated risk calculation - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const score = Math.floor(Math.random() * 100);
      setRiskScore(score);

      toast({
        title: "Risk Assessment Complete",
        description: `Risk score calculated: ${score}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to calculate risk score",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-semibold">Patient Risk Assessment</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="age" className="block text-sm font-medium mb-1">
              Age
            </label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter age"
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium mb-1">
              Gender
            </label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={calculateRiskScore}
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Calculate Risk Score"
            )}
          </Button>

          {riskScore !== null && (
            <div className="mt-4 p-4 bg-background rounded-lg border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Risk Score:</span>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  <span className="text-lg font-bold">{riskScore}%</span>
                </div>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-primary rounded-full h-2.5"
                    style={{ width: `${riskScore}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
