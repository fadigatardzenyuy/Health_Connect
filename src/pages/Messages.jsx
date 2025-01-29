import { useState } from "react";
import { Layout } from "@/components/Layout";
import { ChatInterface } from "@/components/Messaging/ChatInterface";
import { FriendsList } from "@/components/Messaging/FriendLists";
import { MessageCircle } from "lucide-react";

const Messages = () => {
  const [selectedFriend, setSelectedFriend] = useState(null);

  return (
    <Layout>
      <div className="col-span-12 h-[calc(100vh-8rem)] bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
        <div className="grid grid-cols-12 h-full">
          {/* Friends List - Hidden on mobile when chat is open */}
          <div
            className={`${
              selectedFriend ? "hidden md:block" : ""
            } col-span-12 md:col-span-4 lg:col-span-3 border-r border-gray-100 bg-gray-50/50`}
          >
            <FriendsList
              onSelectFriend={setSelectedFriend}
              selectedFriendId={selectedFriend?.id}
            />
          </div>

          {/* Chat Interface or Welcome Screen */}
          <div
            className={`${
              selectedFriend ? "block" : "hidden md:flex"
            } col-span-12 md:col-span-8 lg:col-span-9 h-full bg-gradient-to-br from-white to-gray-50`}
          >
            {selectedFriend ? (
              <ChatInterface
                friend={selectedFriend}
                onBack={() => setSelectedFriend(null)}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center flex-col gap-4 p-4 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <MessageCircle className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Your Messages
                </h2>
                <p className="text-muted-foreground max-w-sm">
                  Select a conversation from the list to start chatting with
                  your healthcare provider
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
