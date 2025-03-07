import { Loader2 } from "lucide-react";
import { PostCard } from "./PostCard";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function PostList({ posts, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <Alert className="bg-muted/30 border-muted my-8">
        <AlertDescription className="text-center py-6">
          No posts found. Be the first to create a post!
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4 mt-2">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
