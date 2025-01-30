import { Users, Clock, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";

export function Sidebar() {
  const friends = [
    {
      id: 1,
      name: "Dr. Sarah",
      image: "https://ui-avatars.com/api/?name=Dr+Sarah",
      online: true,
    },
    {
      id: 2,
      name: "Dr. Mike",
      image: "https://ui-avatars.com/api/?name=Dr+Mike",
      online: false,
    },
    {
      id: 3,
      name: "Dr. Jane",
      image: "https://ui-avatars.com/api/?name=Dr+Jane",
      online: true,
    },
  ];

  const recentChats = [
    {
      id: 1,
      name: "John Doe",
      message: "Hey, how are you feeling today?",
      time: "2m ago",
    },
    {
      id: 2,
      name: "Jane Smith",
      message: "Your last checkup results are ready",
      time: "1h ago",
    },
    {
      id: 3,
      name: "Mike Johnson",
      message: "Don't forget your medication",
      time: "2h ago",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      title: "Appointment Scheduled",
      description: "With Dr. Sarah Johnson",
      time: "1h ago",
    },
    {
      id: 2,
      title: "Prescription Updated",
      description: "By Dr. Michael Chen",
      time: "2h ago",
    },
    {
      id: 3,
      title: "Test Results Available",
      description: "Blood work analysis",
      time: "3h ago",
    },
  ];

  return (
    <div className="space-y-6 sticky top-24">
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Friends</h2>
          <Link to="/messages" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {friends.map((friend) => (
            <Link
              to={`/messages?user=${friend.id}`}
              key={friend.id}
              className="relative"
            >
              <img
                src={friend.image}
                alt={friend.name}
                className="w-12 h-12 rounded-full"
              />
              {friend.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
              )}
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Chats</h2>
          <Link to="/messages" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="space-y-4">
          {recentChats.map((chat) => (
            <Link
              to={`/messages?user=${chat.id}`}
              key={chat.id}
              className="flex items-start gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <img
                src={`https://ui-avatars.com/api/?name=${chat.name}`}
                alt={chat.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium truncate">{chat.name}</h3>
                  <span className="text-xs text-gray-500">{chat.time}</span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-1">
                  {chat.message}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-sm">{activity.title}</h3>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
                <p className="text-sm text-gray-500">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
