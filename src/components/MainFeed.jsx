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
  RefreshCw,
  Plus,
  Users,
  Image,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";

const communityFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(50),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(500),
  is_public: z.boolean().default(true),
});

export function MainFeed() {
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [isPostsLoading, setIsPostsLoading] = useState(true);
  const [isCommunitiesLoading, setIsCommunitiesLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("post");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreateCommunityOpen, setIsCreateCommunityOpen] = useState(false);
  const [isJoiningCommunity, setIsJoiningCommunity] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [isCommunityDetailsOpen, setIsCommunityDetailsOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm({
    resolver: zodResolver(communityFormSchema),
    defaultValues: {
      name: "",
      description: "",
      is_public: true,
    },
  });

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

  useEffect(() => {
    if (activeTab === "social") {
      fetchCommunities();
    }
  }, [activeTab]);

  const fetchCommunities = async () => {
    try {
      setIsCommunitiesLoading(true);

      const { data, error } = await supabase
        .from("communities")
        .select(
          `
          *,
          creator:profiles!creator_id (
            full_name,
            avatar_url
          )
        `
        )
        .order("members_count", { ascending: false });

      if (error) throw error;

      // If user is logged in, check which communities they are a member of
      let membershipData = [];
      if (user) {
        const { data: memberData, error: memberError } = await supabase
          .from("community_members")
          .select("community_id")
          .eq("user_id", user.id);

        if (memberError) {
          console.error("Error fetching memberships:", memberError);
        } else {
          membershipData = memberData || [];
        }
      }

      // Mark which communities the user is a member of
      const communitiesWithMembership =
        data?.map((community) => ({
          ...community,
          is_member: membershipData.some(
            (m) => m.community_id === community.id
          ),
        })) || [];

      setCommunities(communitiesWithMembership);
    } catch (error) {
      console.error("Error fetching communities:", error);
      toast({
        title: "Error",
        description: "Failed to load communities. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsCommunitiesLoading(false);
    }
  };

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

      // Transform the data to match our Post interface
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
      // For each post, extract its author information from the profiles object
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
    if (activeTab === "post") {
      fetchPosts();
    } else if (activeTab === "social") {
      fetchCommunities();
    }
  };

  const onSubmitCommunity = async (values) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a community",
        variant: "destructive",
      });
      return;
    }

    try {
      // Insert new community
      const { data, error } = await supabase
        .from("communities")
        .insert({
          name: values.name,
          description: values.description,
          creator_id: user.id,
          is_public: values.is_public,
        })
        .select()
        .single();

      if (error) throw error;

      // Add creator as a member automatically
      const { error: memberError } = await supabase
        .from("community_members")
        .insert({
          community_id: data.id,
          user_id: user.id,
          role: "admin",
        });

      if (memberError) throw memberError;

      toast({
        title: "Community Created",
        description: "Your community has been created successfully!",
      });

      setIsCreateCommunityOpen(false);
      form.reset();

      // Refresh communities list
      fetchCommunities();
    } catch (error) {
      console.error("Error creating community:", error);
      toast({
        title: "Error",
        description: "Failed to create community. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleJoinCommunity = async (community) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to join communities",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsJoiningCommunity(true);

      if (community.is_member) {
        // Leave community
        const { error } = await supabase
          .from("community_members")
          .delete()
          .match({ community_id: community.id, user_id: user.id });

        if (error) throw error;

        // Update members count
        await supabase
          .from("communities")
          .update({ members_count: Math.max(0, community.members_count - 1) })
          .eq("id", community.id);

        toast({
          title: "Left Community",
          description: `You have left ${community.name}`,
        });
      } else {
        // Join community
        const { error } = await supabase.from("community_members").insert({
          community_id: community.id,
          user_id: user.id,
        });

        if (error) throw error;

        // Update members count
        await supabase
          .from("communities")
          .update({ members_count: community.members_count + 1 })
          .eq("id", community.id);

        toast({
          title: "Joined Community",
          description: `You have joined ${community.name}`,
        });
      }

      // Refresh communities list
      fetchCommunities();
    } catch (error) {
      console.error("Error joining/leaving community:", error);
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsJoiningCommunity(false);
    }
  };

  const openCommunityDetails = (community) => {
    setSelectedCommunity(community);
    setIsCommunityDetailsOpen(true);
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
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Health Communities</h3>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-1"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${
                        isRefreshing ? "animate-spin" : ""
                      }`}
                    />
                    <span className="hidden md:inline">Refresh</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsCreateCommunityOpen(true)}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden md:inline">Create Community</span>
                  </Button>
                </div>
              </div>

              {isCommunitiesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 animate-pulse">
                          <Skeleton className="w-12 h-12 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : communities.length === 0 ? (
                <Card className="border border-gray-200">
                  <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-3">
                    <Users className="h-10 w-10 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium text-lg">
                        No communities yet
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Be the first to create a health community!
                      </p>
                    </div>
                    <Button
                      onClick={() => setIsCreateCommunityOpen(true)}
                      className="mt-2"
                    >
                      Create Community
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {communities.map((community) => (
                    <Card
                      key={community.id}
                      className="cursor-pointer hover:bg-accent/5 transition-colors border border-gray-200"
                      onClick={() => openCommunityDetails(community)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12 border-2 border-primary/10">
                            {community.image_url ? (
                              <AvatarImage src={community.image_url} />
                            ) : (
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {community.name.charAt(0)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{community.name}</h4>
                              {!community.is_public && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-amber-100 text-amber-800 border-amber-200"
                                >
                                  Private
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {community.members_count} members
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-0 px-4 pb-4 flex justify-end">
                        <Button
                          variant={community.is_member ? "outline" : "default"}
                          size="sm"
                          className={community.is_member ? "gap-1" : ""}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJoinCommunity(community);
                          }}
                          disabled={isJoiningCommunity}
                        >
                          {community.is_member ? "Joined" : "Join"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Community Dialog */}
      <Dialog
        open={isCreateCommunityOpen}
        onOpenChange={setIsCreateCommunityOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Community</DialogTitle>
            <DialogDescription>
              Create a new community to connect with people who share your
              health interests.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitCommunity)}
              className="space-y-4 pt-2"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Community Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="E.g., Diabetes Support Group"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what your community is about..."
                        {...field}
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_public"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Public Community
                      </FormLabel>
                      <FormDescription>
                        Public communities are visible to everyone
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateCommunityOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Community</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Community Details Sheet */}
      <Sheet
        open={isCommunityDetailsOpen}
        onOpenChange={setIsCommunityDetailsOpen}
      >
        <SheetContent className="sm:max-w-md overflow-y-auto">
          {selectedCommunity && (
            <>
              <SheetHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <SheetTitle>{selectedCommunity.name}</SheetTitle>
                  {!selectedCommunity.is_public && (
                    <Badge
                      variant="outline"
                      className="bg-amber-100 text-amber-800 border-amber-200"
                    >
                      Private
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedCommunity.creator?.avatar_url} />
                    <AvatarFallback>
                      {selectedCommunity.creator?.full_name?.charAt(0) || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <SheetDescription>
                    Created by{" "}
                    {selectedCommunity.creator?.full_name || "Anonymous"}
                  </SheetDescription>
                </div>
              </SheetHeader>

              <div className="py-4">
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-2">About</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedCommunity.description}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-2">Members</h4>
                  <p className="text-sm">
                    <span className="font-semibold">
                      {selectedCommunity.members_count}
                    </span>{" "}
                    member{selectedCommunity.members_count !== 1 ? "s" : ""}
                  </p>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Posts</h4>
                  <p className="text-sm text-muted-foreground text-center">
                    Community posts coming soon
                  </p>
                </div>
              </div>

              <SheetFooter className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t">
                <div className="w-full flex justify-center">
                  <Button
                    variant={
                      selectedCommunity.is_member ? "outline" : "default"
                    }
                    onClick={() => handleJoinCommunity(selectedCommunity)}
                    disabled={isJoiningCommunity}
                    className="w-full"
                  >
                    {selectedCommunity.is_member
                      ? "Leave Community"
                      : "Join Community"}
                  </Button>
                </div>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
