import React, { useState, useRef } from "react";
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

const initialPosts = [
  {
    id: 1,
    author: "Dr. Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "Remember to stay hydrated during these hot summer days! Drink at least 8 glasses of water daily.",
    image: "/placeholder.svg?height=400&width=600",
    timestamp: "2 hours ago",
    likes: 45,
    comments: [],
    shares: 8,
    liked: false,
  },
  {
    id: 2,
    author: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "Just finished my first 5K run! Thanks to everyone for the support and motivation.",
    video: "https://www.example.com/sample-video.mp4",
    timestamp: "4 hours ago",
    likes: 89,
    comments: [],
    shares: 15,
    liked: false,
  },
  {
    id: 3,
    author: "Dr. Michael Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "New study shows that regular exercise can significantly reduce the risk of heart disease. Start with just 30 minutes a day!",
    image: "/placeholder.svg?height=400&width=600",
    timestamp: "1 day ago",
    likes: 120,
    comments: [],
    shares: 42,
    liked: false,
  },
];

const MainContent = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [newPost, setNewPost] = useState("");
  const [newComments, setNewComments] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const fileInputRef = useRef(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPost.trim() || mediaPreview) {
      const newPostObj = {
        id: posts.length + 1,
        author: "Current User",
        avatar: "/placeholder.svg?height=40&width=40",
        content: newPost,
        timestamp: "Just now",
        likes: 0,
        comments: [],
        shares: 0,
        liked: false,
      };
      if (mediaPreview) {
        if (mediaPreview.startsWith("data:image")) {
          newPostObj.image = mediaPreview;
        } else if (mediaPreview.startsWith("data:video")) {
          newPostObj.video = mediaPreview;
        }
      }
      setPosts([newPostObj, ...posts]);
      setNewPost("");
      setMediaPreview(null);
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
    fileInputRef.current.click();
  };

  const handleLike = (id) => {
    setPosts(
      posts.map((post) =>
        post.id === id
          ? {
              ...post,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
              liked: !post.liked,
            }
          : post
      )
    );
  };

  const handleDelete = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  const handleCommentSubmit = (postId) => {
    const commentContent = newComments[postId];
    if (commentContent && commentContent.trim()) {
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [
                  ...post.comments,
                  {
                    id: post.comments.length + 1,
                    author: "Current User",
                    content: commentContent.trim(),
                    timestamp: "Just now",
                  },
                ],
              }
            : post
        )
      );
      setNewComments({ ...newComments, [postId]: "" });
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
                src={post.avatar}
                alt={post.author}
                className="w-10 h-10 rounded-full mr-2"
              />
              <div>
                <h3 className="font-semibold">{post.author}</h3>
                <p className="text-sm text-gray-500">{post.timestamp}</p>
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
          {post.image && (
            <img
              src={post.image}
              alt="Post content"
              className="w-full h-auto rounded-lg mb-4"
            />
          )}
          {post.video && (
            <video
              src={post.video}
              controls
              className="w-full h-auto rounded-lg mb-4"
            ></video>
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
              <span>{post.likes}</span>
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
              <span>{post.shares}</span>
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
                    <span className="font-semibold">{comment.author}</span>
                    <span className="text-xs text-gray-500">
                      {comment.timestamp}
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
