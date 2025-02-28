import { useState, useEffect } from "react";
import {
  Bell,
  Check,
  Trash,
  Clock,
  Filter,
  Search,
  MoreHorizontal,
  Bookmark,
  Share,
} from "lucide-react";
import { Layout } from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

const NotificationPage = () => {
  // Enhanced notification data with categories and actions
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Message",
      description: "You have a new message from John Doe.",
      timestamp: "2023-10-25T10:30:00",
      read: false,
      category: "messages",
      priority: "high",
      actionable: true,
      actions: ["reply", "archive"],
    },
    {
      id: 2,
      title: "Appointment Reminder",
      description: "Your appointment with Dr. Smith is tomorrow at 10:00 AM.",
      timestamp: "2023-10-24T15:45:00",
      read: true,
      category: "reminders",
      priority: "medium",
      actionable: true,
      actions: ["reschedule", "confirm"],
    },
    {
      id: 3,
      title: "System Update",
      description: "A new system update is available. Please update your app.",
      timestamp: "2023-10-23T09:15:00",
      read: false,
      category: "system",
      priority: "low",
      actionable: true,
      actions: ["update", "dismiss"],
    },
    {
      id: 4,
      title: "Payment Success",
      description: "Your payment of $49.99 has been processed successfully.",
      timestamp: "2023-10-25T08:20:00",
      read: false,
      category: "payments",
      priority: "medium",
      actionable: false,
    },
    {
      id: 5,
      title: "Project Deadline",
      description: "Your project 'Website Redesign' is due in 2 days.",
      timestamp: "2023-10-24T11:10:00",
      read: false,
      category: "reminders",
      priority: "high",
      actionable: true,
      actions: ["extend", "view"],
    },
  ]);

  const [filteredNotifications, setFilteredNotifications] =
    useState(notifications);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  // Update unread count when notifications change
  useEffect(() => {
    const count = notifications.filter((notif) => !notif.read).length;
    setUnreadCount(count);
    applyFilters(activeFilter, searchQuery);
  }, [notifications]);

  // Apply filters and search
  const applyFilters = (filter, query) => {
    let filtered = [...notifications];

    // Apply category filter
    if (filter !== "all") {
      filtered = filtered.filter((notif) => {
        if (filter === "unread") return !notif.read;
        return notif.category === filter;
      });
    }

    // Apply search query
    if (query.trim() !== "") {
      const searchLower = query.toLowerCase();
      filtered = filtered.filter(
        (notif) =>
          notif.title.toLowerCase().includes(searchLower) ||
          notif.description.toLowerCase().includes(searchLower)
      );
    }

    setFilteredNotifications(filtered);
  };

  // Handle filter change
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    applyFilters(filter, searchQuery);
    setIsFilterMenuOpen(false);
  };

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(activeFilter, query);
  };

  // Mark a notification as read/unread
  const toggleReadStatus = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, read: !notification.read }
          : notification
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Delete a specific notification
  const deleteNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  // Group notifications by date
  const groupNotificationsByDate = () => {
    const grouped = {};
    filteredNotifications.forEach((notification) => {
      const date = new Date(notification.timestamp).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(notification);
    });
    return grouped;
  };

  const groupedNotifications = groupNotificationsByDate();

  // Get priority badge color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case "messages":
        return <Mail className="h-4 w-4" />;
      case "reminders":
        return <Clock className="h-4 w-4" />;
      case "system":
        return <Settings className="h-4 w-4" />;
      case "payments":
        return <CreditCard className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
      <div className="col-span-12 w-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Header with enhanced controls */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
              <div className="flex items-center">
                <div className="relative">
                  <Bell className="h-6 w-6 sm:h-8 sm:w-8 mr-3 text-primary" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Notifications
                </h1>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs sm:text-sm"
                >
                  <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="sm:inline hidden">Mark All Read</span>
                  <span className="sm:hidden inline">Read All</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllNotifications}
                  className="text-xs sm:text-sm"
                >
                  <Trash className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="sm:inline hidden">Clear All</span>
                  <span className="sm:hidden inline">Clear</span>
                </Button>
              </div>
            </div>

            {/* Search and filters */}
            <div className="flex flex-col gap-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search notifications..."
                  className="pl-10 w-full"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>

              {/* Mobile and Desktop Tabs */}
              <div className="w-full">
                {/* Mobile dropdown for filters */}
                <div className="sm:hidden">
                  <Button
                    variant="outline"
                    className="w-full flex justify-between items-center"
                    onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                  >
                    <span>
                      Filter:{" "}
                      {activeFilter.charAt(0).toUpperCase() +
                        activeFilter.slice(1)}
                    </span>
                    <Filter className="h-4 w-4 ml-2" />
                  </Button>

                  {isFilterMenuOpen && (
                    <div className="mt-2 bg-white rounded-md shadow-lg border border-gray-200 p-2 z-50">
                      <button
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          activeFilter === "all"
                            ? "bg-gray-100 font-medium"
                            : ""
                        }`}
                        onClick={() => handleFilterChange("all")}
                      >
                        All
                      </button>
                      <button
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          activeFilter === "unread"
                            ? "bg-gray-100 font-medium"
                            : ""
                        }`}
                        onClick={() => handleFilterChange("unread")}
                      >
                        Unread
                      </button>
                      <button
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          activeFilter === "messages"
                            ? "bg-gray-100 font-medium"
                            : ""
                        }`}
                        onClick={() => handleFilterChange("messages")}
                      >
                        Messages
                      </button>
                      <button
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          activeFilter === "reminders"
                            ? "bg-gray-100 font-medium"
                            : ""
                        }`}
                        onClick={() => handleFilterChange("reminders")}
                      >
                        Reminders
                      </button>
                      <button
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          activeFilter === "payments"
                            ? "bg-gray-100 font-medium"
                            : ""
                        }`}
                        onClick={() => handleFilterChange("payments")}
                      >
                        Payments
                      </button>
                    </div>
                  )}
                </div>

                {/* Desktop tabs */}
                <div className="hidden sm:block">
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid grid-cols-5 w-full">
                      <TabsTrigger
                        value="all"
                        onClick={() => handleFilterChange("all")}
                        className="text-xs"
                      >
                        All
                      </TabsTrigger>
                      <TabsTrigger
                        value="unread"
                        onClick={() => handleFilterChange("unread")}
                        className="text-xs"
                      >
                        Unread
                      </TabsTrigger>
                      <TabsTrigger
                        value="messages"
                        onClick={() => handleFilterChange("messages")}
                        className="text-xs"
                      >
                        Messages
                      </TabsTrigger>
                      <TabsTrigger
                        value="reminders"
                        onClick={() => handleFilterChange("reminders")}
                        className="text-xs"
                      >
                        Reminders
                      </TabsTrigger>
                      <TabsTrigger
                        value="payments"
                        onClick={() => handleFilterChange("payments")}
                        className="text-xs"
                      >
                        Payments
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>

          {/* Notification List with animations */}
          {Object.keys(groupedNotifications).length > 0 ? (
            Object.entries(groupedNotifications).map(
              ([date, notifications]) => (
                <div key={date} className="mb-6 sm:mb-8">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4 px-2">
                    {date === new Date().toLocaleDateString()
                      ? "Today"
                      : date ===
                        new Date(
                          new Date().setDate(new Date().getDate() - 1)
                        ).toLocaleDateString()
                      ? "Yesterday"
                      : date}
                  </h2>
                  <AnimatePresence>
                    <div className="space-y-3 sm:space-y-4">
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ duration: 0.2 }}
                          className={`p-4 sm:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all ${
                            notification.read
                              ? "border-l-4 border-l-transparent opacity-75"
                              : "border-l-4 border-l-primary"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start">
                            <div className="flex-grow pr-0 sm:pr-4 mb-3 sm:mb-0">
                              <div className="flex flex-wrap items-center mb-2 gap-2">
                                <h3 className="font-semibold text-base sm:text-lg text-gray-800">
                                  {notification.title}
                                </h3>
                                <Badge
                                  className={`text-xs ${getPriorityColor(
                                    notification.priority
                                  )}`}
                                >
                                  {notification.priority}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">
                                {notification.description}
                              </p>
                              <div className="flex flex-wrap items-center text-xs text-gray-400 gap-2">
                                <div className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>
                                    {new Date(
                                      notification.timestamp
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                                <span className="hidden sm:inline">-</span>
                                <div>
                                  {new Date(
                                    notification.timestamp
                                  ).toLocaleDateString()}
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {notification.category}
                                </Badge>
                              </div>

                              {/* Action buttons for actionable notifications */}
                              {notification.actionable && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                  {notification.actions.map((action) => (
                                    <Button
                                      key={action}
                                      variant="outline"
                                      size="sm"
                                      className="text-xs capitalize"
                                    >
                                      {action}
                                    </Button>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Notification controls */}
                            <div className="flex sm:flex-col flex-row gap-2 justify-end">
                              <button
                                onClick={() =>
                                  toggleReadStatus(notification.id)
                                }
                                className={`p-2 rounded-full hover:bg-gray-100 ${
                                  notification.read
                                    ? "text-gray-400"
                                    : "text-blue-500"
                                }`}
                                title={
                                  notification.read
                                    ? "Mark as unread"
                                    : "Mark as read"
                                }
                              >
                                <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                              </button>
                              <button
                                onClick={() =>
                                  deleteNotification(notification.id)
                                }
                                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500"
                                title="Delete notification"
                              >
                                <Trash className="h-4 w-4 sm:h-5 sm:w-5" />
                              </button>
                              <DropdownMenu>
                                <DropdownMenuTrigger className="p-2 rounded-full hover:bg-gray-100 text-gray-400">
                                  <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem>
                                    <Bookmark className="h-4 w-4 mr-2" />
                                    Save for later
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Share className="h-4 w-4 mr-2" />
                                    Share
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Filter className="h-4 w-4 mr-2" />
                                    Mute similar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </AnimatePresence>
                </div>
              )
            )
          ) : (
            <div className="text-center py-12 sm:py-16 bg-white rounded-xl shadow-sm">
              <Bell className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-300" />
              <p className="mt-4 text-base sm:text-lg text-gray-600">
                No notifications to display.
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                {searchQuery
                  ? "Try a different search query or filter."
                  : "You're all caught up!"}
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilter("all");
                    applyFilters("all", "");
                  }}
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NotificationPage;
