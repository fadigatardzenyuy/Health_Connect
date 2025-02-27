import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Filter, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function FriendsList({ onSelectFriend, selectedFriendId }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock friends data - in a real app this would come from an API
  const friends = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      avatar: "https://i.ibb.co/dvSCZbQ/image-5.jpg",
      lastMessage: "How are you feeling today?",
      lastSeen: "Today, 10:30 AM",
      online: true,
      socialLinks: {
        linkedin: "https://linkedin.com/in/sarahjohnson",
        twitter: "https://twitter.com/drsarah",
        website: "https://drsarahjohnson.med",
      },
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      avatar: "https://i.ibb.co/QjNGjhhJ/image-4.jpg",
      lastMessage: "Your test results look good",
      lastSeen: "Yesterday",
      online: false,
      socialLinks: {
        instagram: "https://instagram.com/dr.michael",
        facebook: "https://facebook.com/drmichaelchen",
      },
    },
    {
      id: 3,
      name: "Dr. Emily Brown",
      avatar: "https://i.ibb.co/BKVdQVB9/image-3.jpg",
      lastMessage: "See you at your next appointment",
      lastSeen: "Today, 9:15 AM",
      online: true,
      socialLinks: {
        twitter: "https://twitter.com/dremily",
        website: "https://dremilybrown.med",
      },
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      avatar: "https://i.ibb.co/3ySwx2Hv/image-2.jpg",
      lastMessage: "Don't forget to take your medicine",
      lastSeen: "2 days ago",
      online: true,
      socialLinks: {
        linkedin: "https://linkedin.com/in/drjameswilson",
      },
    },
  ];

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-4 py-3 bg-[#f0f2f5] flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#333]">Chats</h2>
        <div className="flex gap-2">
          <button className="rounded-full p-2 hover:bg-[#e9edef]">
            <Filter className="h-5 w-5 text-[#54656f]" />
          </button>
          <button className="rounded-full p-2 hover:bg-[#e9edef]">
            <MoreVertical className="h-5 w-5 text-[#54656f]" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-2 bg-white border-b">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-[#54656f]" />
          </div>
          <Input
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-2.5 bg-[#f0f2f5] border-none focus:ring-0 rounded-lg"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="divide-y">
          {filteredFriends.map((friend) => (
            <button
              key={friend.id}
              onClick={() => onSelectFriend(friend)}
              className={cn(
                "w-full flex items-center p-3 hover:bg-[#f5f6f6] transition-colors",
                selectedFriendId === friend.id && "bg-[#f0f2f5]"
              )}
            >
              <div className="relative flex-shrink-0">
                <Avatar className="h-12 w-12 border border-gray-200">
                  <AvatarImage src={friend.avatar} alt={friend.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {friend.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {friend.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="ml-3 flex-1 overflow-hidden text-left">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-[#111b21] truncate">
                    {friend.name}
                  </h3>
                  <span className="text-xs text-[#667781]">
                    {friend.lastSeen}
                  </span>
                </div>
                {friend.lastMessage && (
                  <p className="text-sm text-[#667781] truncate">
                    {friend.lastMessage}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
