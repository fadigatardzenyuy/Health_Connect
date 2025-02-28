import { useState } from "react";
import { Bell, Check, Trash, Clock } from "lucide-react"; // Import icons
import { Layout } from "../components/Layout";

const NotificationPage = () => {
  // Mock notification data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Message",
      description: "You have a new message from John Doe.",
      timestamp: "2023-10-25T10:30:00",
      read: false,
    },
    {
      id: 2,
      title: "Appointment Reminder",
      description: "Your appointment with Dr. Smith is tomorrow at 10:00 AM.",
      timestamp: "2023-10-24T15:45:00",
      read: true,
    },
    {
      id: 3,
      title: "System Update",
      description: "A new system update is available. Please update your app.",
      timestamp: "2023-10-23T09:15:00",
      read: false,
    },
  ]);

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

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Group notifications by date
  const groupNotificationsByDate = () => {
    const grouped = {};
    notifications.forEach((notification) => {
      const date = new Date(notification.timestamp).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(notification);
    });
    return grouped;
  };

  const groupedNotifications = groupNotificationsByDate();

  return (
    <Layout>
      <div className="col-span-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Bell className="h-8 w-8 mr-2 text-primary" />
              Notifications
            </h1>
            <button
              onClick={clearAllNotifications}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Trash className="h-4 w-4 mr-2" />
              Clear All
            </button>
          </div>

          {/* Notification List */}
          {Object.keys(groupedNotifications).length > 0 ? (
            Object.entries(groupedNotifications).map(
              ([date, notifications]) => (
                <div key={date} className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-700 mb-4">
                    {date === new Date().toLocaleDateString()
                      ? "Today"
                      : date ===
                        new Date(
                          new Date().setDate(new Date().getDate() - 1)
                        ).toLocaleDateString()
                      ? "Yesterday"
                      : date}
                  </h2>
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all ${
                          notification.read ? "opacity-75" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-800">
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.description}
                            </p>
                            <p className="text-xs text-gray-400 mt-2 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(
                                notification.timestamp
                              ).toLocaleTimeString()}
                            </p>
                          </div>
                          <button
                            onClick={() => toggleReadStatus(notification.id)}
                            className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )
          ) : (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 mx-auto text-gray-400" />
              <p className="mt-4 text-gray-600">No notifications to display.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NotificationPage;
