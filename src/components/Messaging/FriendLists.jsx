import React from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";

export function FriendsList({ onChatSelect, selectedChat }) {
  // Sample friends data - in a real app, this would come from an API or database
  const friends = [
    {
      id: "1",
      name: "Dr. Jane Smith",
      avatar: "/placeholder.svg",
      lastMessage: "How are you feeling today?",
      time: "10:30 AM",
      unread: 2,
      online: true,
      role: "doctor",
    },
    {
      id: "2",
      name: "Dr. Robert Chen",
      avatar: "/placeholder.svg",
      lastMessage: "Your test results look normal.",
      time: "Yesterday",
      unread: 0,
      online: false,
      role: "doctor",
    },
    {
      id: "3",
      name: "Emily Johnson",
      avatar: "/placeholder.svg",
      lastMessage: "Can I reschedule my appointment?",
      time: "Yesterday",
      unread: 1,
      online: true,
      role: "patient",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search chats..." className="pl-10" />
        </div>
      </div>

      <div className="overflow-y-auto flex-grow">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className={`p-4 flex items-center hover:bg-gray-100 cursor-pointer ${
              selectedChat === friend.id
                ? "bg-gray-100 border-l-4 border-primary"
                : ""
            }`}
            onClick={() => onChatSelect(friend.id)}
          >
            <div className="relative">
              <Avatar>
                <AvatarImage src={friend.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {friend.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              {friend.online && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-3 h-3 border-2 border-white"></div>
              )}
            </div>

            <div className="ml-3 flex-grow min-w-0">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900 truncate">
                  {friend.name}
                </h3>
                <span className="text-xs text-gray-500">{friend.time}</span>
              </div>

              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500 truncate">
                  {friend.lastMessage}
                </p>
                {friend.unread > 0 && (
                  <span className="bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                    {friend.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
