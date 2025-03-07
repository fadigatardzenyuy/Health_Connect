import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DoctorSearch } from "./DoctorSearch";
import { SymptomChecker } from "./AIFeatures/SymptomChecker";
import { HealthAssistant } from "./AIFeatures/HealthAssistant";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { PostForm } from "./posts/PostForm";
import { PostList } from "./posts/PostList";
import { MessageSquare, Star, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export function MainFeed() {
  const [posts, setPosts] = useState([]);
  const [isPostsLoading, setIsPostsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("post");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();

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
          fetchPosts();
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
      setIsRefreshing(true);

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
          author_id,
          profiles!posts_author_id_fkey (
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

      console.log("Raw posts data:", data);

      const transformedPosts = transformPosts(data);

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
      setIsRefreshing(false);
    }
  };

  const transformPosts = (rawPosts) => {
    console.log("Raw posts data:", rawPosts);

    const transformedPosts = rawPosts.map((post) => {
      const author = post.profiles || {};

      return {
        id: post.id,
        content: post.content,
        image_url: post.image_url || "",
        created_at: post.created_at,
        likes_count: post.likes_count || 0,
        comments_count: post.comments_count || 0,
        repost_count: post.repost_count || 0,
        views_count: post.views_count || 0,
        author: {
          full_name: author.full_name || "Unknown User",
          avatar_url: author.avatar_url || "",
          role: author.role || "user",
          is_verified: author.is_verified || false,
        },
      };
    });

    console.log("Posts fetched and transformed:", transformedPosts);
    return transformedPosts;
  };

  const handleRefresh = () => {
    fetchPosts();
  };

  return (
    <div className="col-span-12 md:col-span-6 space-y-4">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <Tabs
          defaultValue="post"
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 p-0">
            <TabsTrigger value="search">Find Doctor</TabsTrigger>
            <TabsTrigger value="post">Social Feed</TabsTrigger>
            <TabsTrigger value="ai" className="hidden md:block">
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="social" className="hidden md:block">
              Communities
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="p-4">
            <DoctorSearch onDoctorSelect={() => {}} />
          </TabsContent>

          <TabsContent value="post" className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Latest Posts</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-1"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </Button>
            </div>
            <PostForm />
            <Separator className="my-4" />
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
                <Card className="cursor-pointer hover:bg-accent transition-colors border border-gray-200">
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

                <Card className="cursor-pointer hover:bg-accent transition-colors border border-gray-200">
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
export default MainFeed;
