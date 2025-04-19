import { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import { FriendsList } from "@/components/Messaging/FriendLists";
import RealtimeChat from "../components/Messaging/RealtimeChat";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      setTimeout(() => {
        if (!user) {
          navigate("/signin");
        }
      }, 500);
    }
  }, [user, navigate]);

  useEffect(() => {
    // Fetch contacts and chat history
    const loadContacts = () => {
      // For demo purposes - in a real app, this would come from an API
      const demoContacts = [
        {
          id: "1",
          name: "Hospital Support",
          avatar: "/placeholder.svg",
          role: "hospital",
          lastMessage: "How are you feeling today?",
          time: "10:30 AM",
          unread: 2,
          online: true,
        },
        {
          id: "2",
          name: "Medical Assistance",
          avatar: "/placeholder.svg",
          role: "support",
          lastMessage: "Your test results are available.",
          time: "Yesterday",
          unread: 0,
          online: false,
        },
        {
          id: "3",
          name: "Appointment Coordinator",
          avatar: "/placeholder.svg",
          role: "staff",
          lastMessage: "Can I reschedule my appointment?",
          time: "Yesterday",
          unread: 1,
          online: true,
        },
      ];

      setContacts(demoContacts);
      setLoading(false);
    };

    loadContacts();
  }, []);

  const handleStartCall = (type) => {
    if (!selectedChat) return;

    const contact = contacts.find((c) => c.id === selectedChat);

    if (contact) {
      toast({
        title: `Starting ${type} call`,
        description: `Connecting to ${contact.name}...`,
      });

      // Navigate to the appropriate consultation page
      setTimeout(() => {
        navigate(`/${type}-consultation/${selectedChat}`);
      }, 1000);
    }
  };

  // Find the currently selected contact
  const selectedContact = contacts.find(
    (contact) => contact.id === selectedChat
  );

  return (
    <Layout>
      <div className="col-span-12 grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-5rem)] rounded-lg overflow-hidden">
        <div className="md:col-span-4 border rounded-lg">
          <FriendsList
            onChatSelect={setSelectedChat}
            selectedChat={selectedChat}
          />
        </div>
        <div className="md:col-span-8">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin">
                <div className="h-8 w-8 border-2 border-primary border-opacity-25 border-t-primary rounded-full"></div>
              </div>
            </div>
          ) : selectedChat && selectedContact ? (
            <RealtimeChat
              receiverId={selectedChat}
              receiverName={selectedContact.name}
              receiverAvatar={selectedContact.avatar}
              onCallStart={handleStartCall}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-muted/5 rounded-lg border">
              <div className="text-center p-6">
                <h3 className="font-medium text-lg mb-2">
                  Select a conversation
                </h3>
                <p className="text-muted-foreground text-sm max-w-md">
                  Choose a contact from the list to start messaging or continue
                  a previous conversation.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
