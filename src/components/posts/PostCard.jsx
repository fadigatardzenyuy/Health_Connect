import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Heart, MessageSquare, Share2, Eye, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";

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
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    try {
      setTimeAgo(
        formatDistanceToNow(new Date(post.created_at), { addSuffix: true })
      );
    } catch (error) {
      console.error("Error formatting date:", error);
      setTimeAgo("some time ago");
    }
  }, [post.created_at]);

  useEffect(() => {
    if (user) {
      checkIfLiked();
    }
  }, [user]);

  useEffect(() => {
    incrementViewCount();
  }, []);

  const checkIfLiked = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("post_likes")
        .select("*")
        .eq("post_id", post.id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      setLiked(!!data);
    } catch (error) {
      console.error("Error checking if post is liked:", error);
    }
  };

  const incrementViewCount = async () => {
    try {
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
      const { error } = await supabase
        .from("posts")
        .update({ repost_count: (post.repost_count || 0) + 1 })
        .eq("id", post.id);

      if (error) throw error;

      setSharesCount((prev) => prev + 1);

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

  const getRoleBadgeClass = () => {
    return post.author?.role === "doctor"
      ? "bg-blue-100 text-blue-800"
      : "bg-green-100 text-green-800";
  };

  return (
    <Card
      key={post.id}
      className="overflow-hidden border-gray-200 hover:border-gray-300 transition-all duration-200"
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-primary/10">
              <AvatarImage src={post.author?.avatar_url} />
              <AvatarFallback className="bg-primary/5 text-primary">
                {post.author?.full_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {post.author?.role === "doctor" && post.author?.is_verified && (
              <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-0.5">
                <Shield className="w-3 h-3" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-gray-900">
                {post.author?.full_name}
              </h3>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClass()}`}
              >
                {post.author?.role === "doctor" ? "Doctor" : "Patient"}
              </span>
              <div className="flex items-center text-gray-500 text-xs">
                <Clock className="w-3 h-3 mr-1" />
                <span>{timeAgo}</span>
              </div>
            </div>

            <div className="mt-3">
              <p className="text-gray-800 whitespace-pre-line">
                {post.content}
              </p>
              {post.image_url && (
                <div className="mt-3 rounded-lg overflow-hidden">
                  <img
                    src={post.image_url}
                    alt="Post attachment"
                    className="w-full rounded-lg object-cover max-h-96"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-2 px-4 border-t flex justify-between bg-gray-50">
        <div className="flex space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center space-x-1 ${
              liked ? "text-red-500" : "text-gray-600"
            } hover:text-red-500`}
            onClick={handleLike}
          >
            <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
            <span>{likesCount > 0 ? likesCount : ""}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1 text-gray-600 hover:text-primary"
            onClick={handleComment}
          >
            <MessageSquare className="h-5 w-5" />
            <span>{commentsCount > 0 ? commentsCount : ""}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1 text-gray-600 hover:text-primary"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5" />
            <span>{sharesCount > 0 ? sharesCount : ""}</span>
          </Button>
        </div>
        <div className="flex items-center space-x-1 text-gray-400">
          <Eye className="h-4 w-4" />
          <span className="text-sm">{viewsCount}</span>
        </div>
      </CardFooter>

      {showCommentInput && (
        <div className="px-4 pb-4 bg-gray-50 border-t">
          <div className="flex space-x-2 pt-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback className="bg-primary/5 text-primary">
                {user?.name?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && submitComment()}
              />
              <div className="flex justify-end">
                <Button size="sm" onClick={submitComment} className="text-xs">
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
