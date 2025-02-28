import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DoctorSearch } from "./DoctorSearch";
import { SymptomChecker } from "./AIFeatures/SymptomChecker";
import { HealthAssistant } from "./AIFeatures/HealthAssistant";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { PostForm } from "./posts/PostForm";
import { PostList } from "./posts/PostList";
import {
  MessageSquare,
  Star,
  Search,
  PenSquare,
  Bot,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export function MainFeed() {
  const [posts, setPosts] = useState([]);
  const [isPostsLoading, setIsPostsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();

    // Subscribe to realtime updates for posts
    const channel = supabase
      .channel("public:posts")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "posts",
        },
        (payload) => {
          console.log("Change received!", payload);
          fetchPosts(); // Refresh posts when any change occurs
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPosts = async () => {
    try {
      console.log("Fetching posts...");
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          id,
          content,
          image_url,
          created_at,
          likes_count,
          comments_count,
          repost_count, 
          views_count,
          author:profiles(
            full_name,
            avatar_url,
            role,
            is_verified
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
        toast({
          title: "Error",
          description: "Failed to load posts. Please try again later.",
          variant: "destructive",
        });
        return;
      }

      // Transform the data
      const transformedPosts = data.map((post) => ({
        id: post.id,
        content: post.content,
        image_url: post.image_url || undefined,
        created_at: post.created_at,
        likes_count: post.likes_count || 0,
        comments_count: post.comments_count || 0,
        repost_count: post.repost_count || 0,
        views_count: post.views_count || 0,
        author: {
          full_name: post.author?.[0]?.full_name || "Unknown User",
          avatar_url: post.author?.[0]?.avatar_url || "",
          role: post.author?.[0]?.role || "user",
          is_verified: post.author?.[0]?.is_verified || false,
        },
      }));

      console.log("Posts fetched and transformed:", transformedPosts);
      setPosts(transformedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: "Error",
        description: "Failed to load posts. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsPostsLoading(false);
    }
  };

  return (
    <div className="col-span-12 md:col-span-6 space-y-4">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Tabs defaultValue="post" className="w-full">
          {/* Custom tabs layout with better mobile spacing */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1 p-1 bg-gray-100">
            <TabsTrigger
              value="search"
              className="p-2 rounded flex items-center justify-center gap-2 font-medium"
            >
              <Search className="w-4 h-4" />
              <span>Find Doctor</span>
            </TabsTrigger>
            <TabsTrigger
              value="post"
              className="p-2 rounded flex items-center justify-center gap-2 font-medium"
            >
              <PenSquare className="w-4 h-4" />
              <span>Create Post</span>
            </TabsTrigger>
            <TabsTrigger
              value="ai"
              className="p-2 rounded flex items-center justify-center gap-2 font-medium"
            >
              <Bot className="w-4 h-4" />
              <span>AI Assistant</span>
            </TabsTrigger>
            <TabsTrigger
              value="social"
              className="p-2 rounded flex items-center justify-center gap-2 font-medium"
            >
              <Users className="w-4 h-4" />
              <span>Community</span>
            </TabsTrigger>
          </div>

          <TabsContent value="search" className="p-4">
            <DoctorSearch />
          </TabsContent>

          <TabsContent value="post" className="p-4">
            <PostForm />
            <PostList posts={posts} isLoading={isPostsLoading} />
          </TabsContent>

          <TabsContent value="ai" className="p-4 space-y-6">
            <SymptomChecker />
            <HealthAssistant />
          </TabsContent>

          <TabsContent value="social" className="p-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Health Communities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="cursor-pointer hover:bg-accent transition-colors border border-transparent hover:border-primary/10">
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

                <Card className="cursor-pointer hover:bg-accent transition-colors border border-transparent hover:border-primary/10">
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
