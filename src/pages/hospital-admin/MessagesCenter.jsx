import { useState } from "react";
import { AdminLayout } from "@/components/hospital-admin/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Send,
  Search,
  CheckCircle2,
  Clock,
  MessageSquare,
  User,
  Plus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MessagesCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [activeTab, setActiveTab] = useState("inbox");
  const [selectedConversation, setSelectedConversation] = useState("msg-1");

  // Mock conversations data
  const conversations = [
    {
      id: "msg-1",
      participantName: "Clara Johnson",
      participantRole: "patient",
      avatarUrl: "",
      lastMessage: "I need to reschedule my appointment for tomorrow",
      lastMessageDate: "2025-04-05T14:30:00",
      unread: true,
    },
    {
      id: "msg-2",
      participantName: "Dr. Sarah Nkeng",
      participantRole: "doctor",
      avatarUrl: "",
      lastMessage: "Patient records have been updated. Please review.",
      lastMessageDate: "2025-04-05T11:15:00",
      unread: false,
    },
    {
      id: "msg-3",
      participantName: "Samuel Ndong",
      participantRole: "patient",
      avatarUrl: "",
      lastMessage: "What time should I arrive for my procedure?",
      lastMessageDate: "2025-04-04T16:45:00",
      unread: true,
    },
    {
      id: "msg-4",
      participantName: "Nursing Department",
      participantRole: "staff",
      avatarUrl: "",
      lastMessage: "Staff meeting scheduled for Monday at 9 AM",
      lastMessageDate: "2025-04-04T09:30:00",
      unread: false,
    },
    {
      id: "msg-5",
      participantName: "Elizabeth Fombu",
      participantRole: "patient",
      avatarUrl: "",
      lastMessage: "I need a copy of my medical certificate",
      lastMessageDate: "2025-04-03T13:20:00",
      unread: false,
    },
  ];

  // Mock messages for the selected conversation
  const messages = [
    {
      id: "msg-1-1",
      conversationId: "msg-1",
      senderId: "patient-1",
      senderName: "Clara Johnson",
      senderRole: "patient",
      content:
        "Hello, I need to reschedule my appointment for tomorrow. I won't be able to make it due to an emergency.",
      timestamp: "2025-04-05T14:30:00",
      read: false,
    },
    {
      id: "msg-1-2",
      conversationId: "msg-1",
      senderId: "admin-1",
      senderName: "Hospital Admin",
      senderRole: "admin",
      content:
        "I'm sorry to hear that. Let me check the available slots for you. What time would work better for you?",
      timestamp: "2025-04-05T14:35:00",
      read: true,
    },
    {
      id: "msg-1-3",
      conversationId: "msg-1",
      senderId: "patient-1",
      senderName: "Clara Johnson",
      senderRole: "patient",
      content: "Would next Monday at the same time work?",
      timestamp: "2025-04-05T14:40:00",
      read: false,
    },
  ];

  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch =
      searchQuery === "" ||
      conversation.participantName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "inbox" ||
      (activeTab === "unread" && conversation.unread) ||
      (activeTab === "patients" &&
        conversation.participantRole === "patient") ||
      (activeTab === "staff" &&
        ["doctor", "staff"].includes(conversation.participantRole));

    return matchesSearch && matchesTab;
  });

  const currentMessages = messages.filter(
    (message) => message.conversationId === selectedConversation
  );

  const currentConversation = conversations.find(
    (conversation) => conversation.id === selectedConversation
  );

  const handleSendMessage = () => {
    if (messageText.trim() === "") return;
    setMessageText("");
    // In a real app, send the message to the backend and update the state
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Messages Center
            </h1>
            <p className="text-muted-foreground">
              Communicate with patients, doctors, and staff
            </p>
          </div>

          <div className="flex gap-2">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Message
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Conversations List */}
          <Card className="lg:col-span-4">
            <CardHeader className="pb-3">
              <CardTitle>Conversations</CardTitle>
              <form onSubmit={handleSearch} className="mt-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search messages..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </CardHeader>

            <Tabs
              defaultValue="inbox"
              value={activeTab}
              onValueChange={setActiveTab}
              className="px-4"
            >
              <TabsList className="w-full grid grid-cols-4 mb-4">
                <TabsTrigger value="inbox">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
                <TabsTrigger value="patients">Patients</TabsTrigger>
                <TabsTrigger value="staff">Staff</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="m-0">
                <CardContent className="p-0 pb-4 overflow-auto max-h-[600px]">
                  <div className="space-y-1">
                    {filteredConversations.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No conversations found
                      </div>
                    ) : (
                      filteredConversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          className={`p-3 cursor-pointer hover:bg-muted/50 rounded-md ${
                            selectedConversation === conversation.id
                              ? "bg-muted"
                              : ""
                          } ${conversation.unread ? "font-medium" : ""}`}
                          onClick={() =>
                            setSelectedConversation(conversation.id)
                          }
                        >
                          <div className="flex gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={conversation.avatarUrl}
                                alt={conversation.participantName}
                              />
                              <AvatarFallback>
                                {conversation.participantName
                                  .split(" ")
                                  .map((name) => name[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center">
                                <div className="font-medium truncate">
                                  {conversation.participantName}
                                </div>
                                <div className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                  {new Date(
                                    conversation.lastMessageDate
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="text-sm truncate">
                                {conversation.lastMessage}
                              </div>
                              <div className="flex justify-between items-center mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {conversation.participantRole === "patient"
                                    ? "Patient"
                                    : conversation.participantRole === "doctor"
                                    ? "Doctor"
                                    : "Staff"}
                                </Badge>
                                {conversation.unread && (
                                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Messages View */}
          <Card className="lg:col-span-8">
            {selectedConversation ? (
              <>
                <CardHeader className="pb-3 border-b">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={currentConversation?.avatarUrl}
                          alt={currentConversation?.participantName}
                        />
                        <AvatarFallback>
                          {currentConversation?.participantName
                            .split(" ")
                            .map((name) => name[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>
                          {currentConversation?.participantName}
                        </CardTitle>
                        <CardDescription>
                          {currentConversation?.participantRole === "patient"
                            ? "Patient"
                            : currentConversation?.participantRole === "doctor"
                            ? "Doctor"
                            : "Staff"}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 overflow-auto h-[400px] flex flex-col space-y-4">
                  {currentMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderRole === "admin" ? "justify-end" : ""
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.senderRole === "admin"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <div className="text-sm mb-1 font-medium">
                          {message.senderName}
                        </div>
                        <div>{message.content}</div>
                        <div className="text-xs mt-1 opacity-70 text-right">
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {message.senderRole === "admin" && (
                            <span className="ml-1">
                              {message.read ? (
                                <CheckCircle2 className="inline h-3 w-3" />
                              ) : (
                                <Clock className="inline h-3 w-3" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>

                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your message..."
                      className="min-h-10"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">
                    No Conversation Selected
                  </h3>
                  <p className="text-muted-foreground">
                    Select a conversation from the list to view messages
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
