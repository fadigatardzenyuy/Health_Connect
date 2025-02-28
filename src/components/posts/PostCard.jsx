import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Heart, MessageSquare, Share2, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export function PostCard({ post }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [commentsCount, setCommentsCount] = useState(post.comments_count || 0);
  const [sharesCount, setSharesCount] = useState(post.repost_count || 0);
  const [viewsCount, setViewsCount] = useState(post.views_count || 0);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState("");

  // Increment view count when post is rendered
  useEffect(() => {
    incrementViewCount();
  }, []);

  const incrementViewCount = async () => {
    try {
      // Only increment if user is logged in (to prevent spam)
      if (user) {
        const { error } = await supabase
          .from("posts")
          .update({ views_count: (post.views_count || 0) + 1 })
          .eq("id", post.id);

        if (!error) {
          setViewsCount((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like posts",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!liked) {
        // Add a like
        const { error } = await supabase.from("post_likes").insert({
          post_id: post.id,
          user_id: user.id,
        });

        if (error) throw error;

        setLiked(true);
        setLikesCount((prev) => prev + 1);

        toast({
          title: "Post liked",
          description: "You've liked this post",
        });
      } else {
        // Remove a like
        const { error } = await supabase
          .from("post_likes")
          .delete()
          .match({ post_id: post.id, user_id: user.id });

        if (error) throw error;

        setLiked(false);
        setLikesCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description: "Failed to process your action",
        variant: "destructive",
      });
    }
  };

  const handleComment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to comment on posts",
        variant: "destructive",
      });
      return;
    }

    setShowCommentInput(!showCommentInput);
  };

  const submitComment = async () => {
    if (!commentText.trim()) return;

    try {
      const { error } = await supabase.from("post_comments").insert({
        post_id: post.id,
        user_id: user.id,
        content: commentText.trim(),
      });

      if (error) throw error;

      setCommentText("");
      setShowCommentInput(false);
      setCommentsCount((prev) => prev + 1);

      toast({
        title: "Comment added",
        description: "Your comment has been added",
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to add your comment",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    try {
      // Increment share count
      const { error } = await supabase
        .from("posts")
        .update({ repost_count: (post.repost_count || 0) + 1 })
        .eq("id", post.id);

      if (error) throw error;

      setSharesCount((prev) => prev + 1);

      // Copy post link to clipboard
      const postUrl = `${window.location.origin}/post/${post.id}`;
      await navigator.clipboard.writeText(postUrl);

      toast({
        title: "Link copied",
        description: "Post link copied to clipboard",
      });
    } catch (error) {
      console.error("Error sharing post:", error);
      toast({
        title: "Error",
        description: "Failed to share post",
        variant: "destructive",
      });
    }
  };

  return (
    <Card key={post.id}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <Avatar>
            <AvatarImage src={post.author?.avatar_url} />
            <AvatarFallback>{post.author?.full_name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold">{post.author?.full_name}</h3>
              {post.author?.role === "doctor" && post.author?.is_verified && (
                <Shield className="w-4 h-4 text-primary" />
              )}
            </div>
            <p className="text-sm text-gray-500">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
            <p className="mt-2">{post.content}</p>
            {post.image_url && (
              <img
                src={post.image_url}
                alt="Post attachment"
                className="mt-2 rounded-lg max-h-96 object-cover"
              />
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-2 px-4 border-t flex justify-between">
        <div className="flex space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1 text-gray-600 hover:text-primary"
            onClick={handleLike}
          >
            <Heart
              className={`h-5 w-5 ${liked ? "fill-current text-red-500" : ""}`}
            />
            <span>{likesCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1 text-gray-600 hover:text-primary"
            onClick={handleComment}
          >
            <MessageSquare className="h-5 w-5" />
            <span>{commentsCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1 text-gray-600 hover:text-primary"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5" />
            <span>{sharesCount}</span>
          </Button>
        </div>
        <div className="flex items-center space-x-1 text-gray-400">
          <Eye className="h-4 w-4" />
          <span className="text-sm">{viewsCount}</span>
        </div>
      </CardFooter>

      {showCommentInput && (
        <div className="px-4 pb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && submitComment()}
            />
            <Button size="sm" onClick={submitComment}>
              Post
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
