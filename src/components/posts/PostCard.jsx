import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

export function PostCard({ post }) {
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
    </Card>
  );
}
