import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Video, Send, Shield, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export function PostForm() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) return;
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a post",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.from("posts").insert({
        content: content.trim(),
        author_id: user.id,
      });

      if (error) throw error;

      setContent("");
      toast({
        title: "Success",
        description: "Your post has been published",
      });
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        {user?.role === "doctor" && user?.isVerified && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            <Shield className="w-3 h-3 mr-1" />
            Verified Doctor
          </span>
        )}
      </div>
      <Textarea
        placeholder="Share your health journey or ask a question..."
        className="w-full resize-none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <Image className="w-4 h-4 mr-2" />
            <span className="hidden md:inline">Image</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <Video className="w-4 h-4 mr-2" />
            <span className="hidden md:inline">Video</span>
          </Button>
        </div>
        <Button
          className="flex items-center"
          onClick={handlePost}
          disabled={isLoading || !content.trim()}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Send className="w-4 h-4 mr-2" />
          )}
          <span>Post</span>
        </Button>
      </div>
    </div>
  );
}
