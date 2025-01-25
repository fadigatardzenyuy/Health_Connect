import React, { useState, useRef, useEffect } from "react";
import { supabase } from "../utils/SupaBaseClient";
import { useUser } from "@clerk/clerk-react";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Trash2,
  Send,
  Image,
  Video,
} from "lucide-react";

const MainContent = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [newComments, setNewComments] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const fileInputRef = useRef(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data: postsData, error } = await supabase
      .from("posts")
      .select("*, user:users(*)") // Assuming 'users' is the table where user data is stored
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setPosts(
        postsData.map((post) => ({
          ...post,
          comments: post.comments || [],
          likes: post.likes || [],
          liked: post.likes.some((like) => like.user_id === user?.id),
        }))
      );
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (newPost.trim() || mediaPreview) {
      const { data, error } = await supabase.from("posts").insert([
        {
          content: newPost,
          media_url: mediaPreview,
          media_type: mediaType,
          user_id: user.id,
        },
      ]);

      if (error) {
        console.error(error);
      } else {
        setPosts([data[0], ...posts]);
      }
      setNewPost("");
      setMediaPreview(null);
      setMediaType(null);
    }
  };

  const handleDeletePost = async (id) => {
    const { error } = await supabase.from("posts").delete().match({ id });
    if (!error) {
      setPosts(posts.filter((post) => post.id !== id));
    }
  };

  const handleLike = async (postId) => {
    const { data: likeData, error } = await supabase
      .from("likes")
      .select("*")
      .match({ post_id: postId, user_id: user.id });

    if (likeData.length > 0) {
      // Unlike
      await supabase
        .from("likes")
        .delete()
        .match({ post_id: postId, user_id: user.id });
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: post.likes.filter((like) => like.user_id !== user.id),
                liked: false,
              }
            : post
        )
      );
    } else {
      // Like
      await supabase
        .from("likes")
        .insert([{ post_id: postId, user_id: user.id }]);
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: [...post.likes, { user_id: user.id }],
                liked: true,
              }
            : post
        )
      );
    }
  };

  const handleCommentSubmit = async (postId) => {
    const commentContent = newComments[postId];
    if (commentContent && commentContent.trim()) {
      const { data, error } = await supabase
        .from("comments")
        .insert([
          { post_id: postId, user_id: user.id, content: commentContent.trim() },
        ]);

      if (!error) {
        setPosts(
          posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: [
                    ...(post.comments || []),
                    {
                      id: data[0].id,
                      author: user.firstName,
                      content: commentContent.trim(),
                      created_at: "Just now",
                    },
                  ],
                }
              : post
          )
        );
        setNewComments({ ...newComments, [postId]: "" });
      }
    }
  };

  const toggleComments = (postId) => {
    setExpandedComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <main className="space-y-4">
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <form onSubmit={handlePostSubmit}>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="What's on your mind?"
            rows={3}
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          {mediaPreview && (
            <div className="mt-2 relative">
              {mediaType === "image" ? (
                <img
                  src={mediaPreview}
                  alt="Preview"
                  className="max-w-full h-auto rounded-lg"
                />
              ) : (
                <video
                  src={mediaPreview}
                  className="max-w-full h-auto rounded-lg"
                  controls
                />
              )}
              <button
                onClick={() => {
                  setMediaPreview(null);
                  setMediaType(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition duration-300"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
          <div className="flex justify-between items-center mt-2">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="text-primary hover:text-primary-dark transition duration-300 flex items-center"
            >
              <Image size={20} className="mr-1" />
              <Video size={20} className="mr-1" />
              Add Image/Video
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setMediaPreview(reader.result);
                    setMediaType(
                      file.type.startsWith("video") ? "video" : "image"
                    );
                  };
                  reader.readAsDataURL(file);
                }
              }}
              accept="image/*,video/*"
              className="hidden"
            />
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark transition duration-300"
            >
              Post
            </button>
          </div>
        </form>
      </div>
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <img
                src={post.user?.profile_image || "/placeholder.svg"} // Safe access with optional chaining
                alt={post.user?.name || "User"} // Safe access with optional chaining
                className="w-10 h-10 rounded-full mr-2"
              />
              <div>
                <h3 className="font-semibold">{post.user?.name || "User"}</h3>
                <p className="text-sm text-gray-500">{post.created_at}</p>
              </div>
            </div>
            <div className="relative group">
              <button className="text-gray-500 hover:text-gray-700">
                <MoreHorizontal size={20} />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block">
                <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                  <Edit2 size={16} className="inline mr-2" /> Edit
                </button>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                >
                  <Trash2 size={16} className="inline mr-2" /> Delete
                </button>
              </div>
            </div>
          </div>
          <p className="mb-4">{post.content}</p>
          {post.media_type === "image" && post.media_url && (
            <img
              src={post.media_url}
              alt="Post content"
              className="w-full h-auto rounded-lg mb-4"
            />
          )}
          {post.media_type === "video" && post.media_url && (
            <video
              src={post.media_url}
              controls
              className="w-full h-auto rounded-lg mb-4"
            />
          )}
          <div className="flex justify-between items-center">
            <button
              onClick={() => handleLike(post.id)}
              className={`flex items-center space-x-1 ${
                post.liked ? "text-primary" : "text-gray-500 hover:text-primary"
              }`}
            >
              <Heart
                className={`h-5 w-5 ${post.liked ? "fill-current" : ""}`}
              />
              <span>{post.likes.length || 0}</span>
            </button>
            <button
              onClick={() => toggleComments(post.id)}
              className="flex items-center space-x-1 text-gray-500 hover:text-primary"
            >
              <MessageCircle className="h-5 w-5" />
              <span>{(post.comments && post.comments.length) || 0}</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-blue-500">
              <Share2 className="h-5 w-5" />
              <span>{post.shares || 0}</span>
            </button>
          </div>
          {expandedComments[post.id] && (
            <div className="mt-4">
              {(post.comments || []).map((comment) => (
                <div
                  key={comment.id}
                  className="bg-gray-100 p-3 rounded-lg mb-2"
                >
                  <div className="flex justify-between">
                    <span className="font-semibold">
                      {comment.author || "User"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {comment.created_at}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{comment.content}</p>
                </div>
              ))}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCommentSubmit(post.id);
                }}
                className="mt-2 flex"
              >
                <input
                  type="text"
                  value={newComments[post.id] || ""}
                  onChange={(e) =>
                    setNewComments({
                      ...newComments,
                      [post.id]: e.target.value,
                    })
                  }
                  placeholder="Write a comment..."
                  className="flex-grow border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white rounded-r-lg px-4 py-2 hover:bg-blue-600"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          )}
        </div>
      ))}
    </main>
  );
};

export default MainContent;
