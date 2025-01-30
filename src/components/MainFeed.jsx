import { Image, Video, Send, MessageSquare, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { DoctorSearch } from "./DoctorSearch";
import { SymptomChecker } from "./AIFeatures/SymptomChecker";
import { HealthAssistant } from "./AIFeatures/HealthAssistant";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export function MainFeed() {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <div className="col-span-12 md:col-span-6 space-y-4">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 p-0">
            <TabsTrigger value="search">Find Doctor</TabsTrigger>
            <TabsTrigger value="post">Create Post</TabsTrigger>
            <TabsTrigger value="ai" className="hidden md:block">
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="social" className="hidden md:block">
              Social
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="p-4">
            <DoctorSearch />
          </TabsContent>

          <TabsContent value="post" className="p-4">
            <Textarea
              placeholder="Share your health journey or ask a question..."
              className="w-full mb-4 resize-none"
            />
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Image className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">Image</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Video className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">Video</span>
                </Button>
              </div>
              <Button className="flex items-center">
                <Send className="w-4 h-4 mr-2" />
                <span>Post</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="p-4 space-y-6">
            <SymptomChecker />
            <HealthAssistant />
          </TabsContent>

          <TabsContent value="social" className="p-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Health Communities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="cursor-pointer hover:bg-accent transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-8 h-8 text-primary" />
                      <div>
                        <h4 className="font-medium">Support Group</h4>
                        <p className="text-sm text-muted-foreground">
                          1.2k members
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-accent transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Star className="w-8 h-8 text-primary" />
                      <div>
                        <h4 className="font-medium">Health Forum</h4>
                        <p className="text-sm text-muted-foreground">
                          3.5k members
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
