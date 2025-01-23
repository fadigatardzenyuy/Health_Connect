import React, { useState, useRef, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Edit2,
  Trash2,
  Send,
  Image,
  Video,
} from "lucide-react";
import {
  createPost,
  getPosts,
  likePost,
  unlikePost,
  createComment,
  deletePost,
} from "../utils/Apis.js";

const MainContent = ({ currentUser }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [newComments, setNewComments] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const fileInputRef = useRef(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (newPost.trim() || mediaPreview) {
      try {
        const createdPost = await createPost(
          currentUser.id,
          newPost,
          mediaPreview?.startsWith("data:image") ? mediaPreview : undefined,
          mediaPreview?.startsWith("data:video") ? mediaPreview : undefined
        );
        setPosts([createdPost, ...posts]);
        setNewPost("");
        setMediaPreview(null);
      } catch (error) {
        console.error("Error creating post:", error);
      }
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMediaButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleLike = async (postId) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const isLiked = post.likes.some((like) => like.user_id === currentUser.id);

    try {
      if (isLiked) {
        await unlikePost(currentUser.id, postId);
        setPosts(
          posts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  likes: p.likes.filter(
                    (like) => like.user_id !== currentUser.id
                  ),
                }
              : p
          )
        );
      } else {
        await likePost(currentUser.id, postId);
        setPosts(
          posts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  likes: [
                    ...p.likes,
                    { id: Date.now(), user_id: currentUser.id },
                  ],
                }
              : p
          )
        );
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleCommentSubmit = async (postId) => {
    const commentContent = newComments[postId];
    if (commentContent && commentContent.trim()) {
      try {
        const createdComment = await createComment(
          currentUser.id,
          postId,
          commentContent.trim()
        );
        setPosts(
          posts.map((post) =>
            post.id === postId
              ? { ...post, comments: [...post.comments, createdComment] }
              : post
          )
        );
        setNewComments({ ...newComments, [postId]: "" });
      } catch (error) {
        console.error("Error creating comment:", error);
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
              {mediaPreview.startsWith("data:image") ? (
                <img
                  src={mediaPreview || "/placeholder.svg"}
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
                onClick={() => setMediaPreview(null)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition duration-300"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
          <div className="flex justify-between items-center mt-2">
            <button
              type="button"
              onClick={handleMediaButtonClick}
              className="text-primary hover:text-primary-dark transition duration-300 flex items-center"
            >
              <Image size={20} className="mr-1" />
              <Video size={20} className="mr-1" />
              Add Image/Video
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
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
                src={
                  post.users.profile_image ||
                  "/placeholder.svg?height=40&width=40"
                }
                alt={post.users.name}
                className="w-10 h-10 rounded-full mr-2"
              />
              <div>
                <h3 className="font-semibold">{post.users.name}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(post.created_at).toLocaleString()}
                </p>
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
                  onClick={() => handleDelete(post.id)}
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                >
                  <Trash2 size={16} className="inline mr-2" /> Delete
                </button>
              </div>
            </div>
          </div>
          <p className="mb-4">{post.content}</p>
          {post.image_url && (
            <img
              src={post.image_url || "/placeholder.svg"}
              alt="Post content"
              className="w-full h-auto rounded-lg mb-4"
            />
          )}
          {post.video_url && (
            <video
              src={post.video_url}
              controls
              className="w-full h-auto rounded-lg mb-4"
            ></video>
          )}
          <div className="flex justify-between items-center">
            <button
              onClick={() => handleLike(post.id)}
              className={`flex items-center space-x-1 ${
                post.likes.some((like) => like.user_id === currentUser.id)
                  ? "text-primary"
                  : "text-gray-500 hover:text-primary"
              }`}
            >
              <Heart
                className={`h-5 w-5 ${
                  post.likes.some((like) => like.user_id === currentUser.id)
                    ? "fill-current"
                    : ""
                }`}
              />
              <span>{post.likes.length}</span>
            </button>
            <button
              onClick={() => toggleComments(post.id)}
              className="flex items-center space-x-1 text-gray-500 hover:text-primary"
            >
              <MessageCircle className="h-5 w-5" />
              <span>{post.comments.length}</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-blue-500">
              <Share2 className="h-5 w-5" />
              <span>0</span>
            </button>
          </div>
          {expandedComments[post.id] && (
            <div className="mt-4">
              {post.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-gray-100 p-3 rounded-lg mb-2"
                >
                  <div className="flex justify-between">
                    <span className="font-semibold">{comment.users.name}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleString()}
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
