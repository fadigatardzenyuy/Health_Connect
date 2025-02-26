import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Video, Send, Shield, Loader2, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export function PostForm() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mediaPreview, setMediaPreview] = useState(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handleFileSelect = async (event, type) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (type === "image" && !file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    if (type === "video" && !file.type.startsWith("video/")) {
      toast({
        title: "Invalid file type",
        description: "Please select a video file",
        variant: "destructive",
      });
      return;
    }

    // Create preview URL
    const preview = URL.createObjectURL(file);
    setMediaPreview({ file, type, preview });
  };

  const uploadMedia = async (file) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from("post-media")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      throw uploadError;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("post-media").getPublicUrl(filePath);

    return publicUrl;
  };

  const handlePost = async () => {
    if (!content.trim() && !mediaPreview) return;
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
      let mediaUrl = null;

      if (mediaPreview) {
        mediaUrl = await uploadMedia(mediaPreview.file);
      }

      const postData = {
        content: content.trim(),
        author_id: user.id,
        ...(mediaPreview?.type === "image" && { image_url: mediaUrl }),
        ...(mediaPreview?.type === "video" && { video_url: mediaUrl }),
      };

      const { error } = await supabase.from("posts").insert(postData);

      if (error) throw error;

      setContent("");
      setMediaPreview(null);
      if (imageInputRef.current) imageInputRef.current.value = "";
      if (videoInputRef.current) videoInputRef.current.value = "";

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

  const clearMedia = () => {
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview.preview);
      setMediaPreview(null);
      if (imageInputRef.current) imageInputRef.current.value = "";
      if (videoInputRef.current) videoInputRef.current.value = "";
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
      {mediaPreview && (
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
            onClick={clearMedia}
          >
            <X className="h-4 w-4" />
          </Button>
          {mediaPreview.type === "image" ? (
            <img
              src={mediaPreview.preview}
              alt="Preview"
              className="max-h-[300px] w-full object-cover rounded-md"
            />
          ) : (
            <video
              src={mediaPreview.preview}
              controls
              className="max-h-[300px] w-full object-cover rounded-md"
            />
          )}
        </div>
      )}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={imageInputRef}
            onChange={(e) => handleFileSelect(e, "image")}
            accept="image/*"
            className="hidden"
          />
          <input
            type="file"
            ref={videoInputRef}
            onChange={(e) => handleFileSelect(e, "video")}
            accept="video/*"
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={() => imageInputRef.current?.click()}
            disabled={!!mediaPreview}
          >
            <Image className="w-4 h-4 mr-2" />
            <span className="hidden md:inline">Image</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={() => videoInputRef.current?.click()}
            disabled={!!mediaPreview}
          >
            <Video className="w-4 h-4 mr-2" />
            <span className="hidden md:inline">Video</span>
          </Button>
        </div>
        <Button
          className="flex items-center"
          onClick={handlePost}
          disabled={isLoading || (!content.trim() && !mediaPreview)}
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
