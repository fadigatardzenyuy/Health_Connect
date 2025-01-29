import { Users, Clock, Bell } from "lucide-react";

export function Sidebar() {
  const friends = [
    {
      id: 1,
      name: "Dr. Sarah",
      image: "https://ui-avatars.com/api/?name=Dr+Sarah",
    },
    {
      id: 2,
      name: "Dr. Mike",
      image: "https://ui-avatars.com/api/?name=Dr+Mike",
    },
    {
      id: 3,
      name: "Dr. Jane",
      image: "https://ui-avatars.com/api/?name=Dr+Jane",
    },
  ];

  const recentChats = [
    { id: 1, name: "John Doe", message: "Hey, how are you feeling today?" },
    {
      id: 2,
      name: "Jane Smith",
      message: "Your last checkup results are ready",
    },
    { id: 3, name: "Mike Johnson", message: "Don't forget your medication" },
  ];

  return (
    <div className="space-y-6 sticky top-24">
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Friends</h2>
        <div className="flex flex-wrap gap-2">
          {friends.map((friend) => (
            <div key={friend.id} className="relative">
              <img
                src={friend.image}
                alt={friend.name}
                className="w-12 h-12 rounded-full"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Recent Chats</h2>
        <div className="space-y-4">
          {recentChats.map((chat) => (
            <div key={chat.id} className="flex items-start gap-3">
              <img
                src={`https://ui-avatars.com/api/?name=${chat.name}`}
                alt={chat.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="font-medium">{chat.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-1">
                  {chat.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
