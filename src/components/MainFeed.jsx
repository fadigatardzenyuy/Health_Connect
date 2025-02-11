import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DoctorSearch } from "./DoctorSearch";
import { SymptomChecker } from "./AIFeatures/SymptomChecker";
import { HealthAssistant } from "./AIFeatures/HealthAssistant";
import { supabase } from "@/lib/supabase";
import { PostForm } from "./posts/PostForm";
import { PostList } from "./posts/PostList";
import { MessageSquare, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function MainFeed() {
  const [posts, setPosts] = useState([]);
  const [isPostsLoading, setIsPostsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    // Subscribe to realtime updates
    const channel = supabase
      .channel("public:posts")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "posts",
        },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          *,
          author:profiles(full_name, avatar_url, role, is_verified)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsPostsLoading(false);
    }
  };

  return (
    <div className="col-span-12 md:col-span-6 space-y-4">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Tabs defaultValue="post" className="w-full">
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
