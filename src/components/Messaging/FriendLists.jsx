import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function FriendsList({ onSelectFriend, selectedFriendId }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock friends data - in a real app this would come from an API
  const friends = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      avatar:
        "https://ui-avatars.com/api/?name=Sarah+Johnson&background=6366f1&color=fff",
      lastMessage: "How are you feeling today?",
      online: true,
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      avatar:
        "https://ui-avatars.com/api/?name=Michael+Chen&background=8b5cf6&color=fff",
      lastMessage: "Your test results look good",
      online: false,
    },
    {
      id: 3,
      name: "Dr. Emily Brown",
      avatar:
        "https://ui-avatars.com/api/?name=Emily+Brown&background=ec4899&color=fff",
      lastMessage: "See you at your next appointment",
      online: true,
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      avatar:
        "https://ui-avatars.com/api/?name=James+Wilson&background=14b8a6&color=fff",
      lastMessage: "Don't forget to take your medicine",
      online: true,
    },
  ];

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white/80 focus:bg-white transition-colors"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredFriends.map((friend) => (
            <button
              key={friend.id}
              onClick={() => onSelectFriend(friend)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
                selectedFriendId === friend.id
                  ? "bg-primary/10 hover:bg-primary/15"
                  : "hover:bg-gray-100"
              )}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-12 h-12 rounded-full shadow-sm"
                />
                {friend.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <h3 className="font-medium text-gray-900 truncate">
                  {friend.name}
                </h3>
                {friend.lastMessage && (
                  <p className="text-sm text-muted-foreground line-clamp-1">
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
