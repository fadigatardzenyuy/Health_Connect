import React from "react";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { friends } from "../constants/constants";

// const friends = [
//   {
//     id: 1,
//     name: "John Doe",
//     image: "/placeholder.svg?height=40&width=40",
//     status: "online",
//   },
//   {
//     id: 2,
//     name: "Jane Smith",
//     image: "/placeholder.svg?height=40&width=40",
//     status: "offline",
//   },
//   {
//     id: 3,
//     name: "Mike Johnson",
//     image: "/placeholder.svg?height=40&width=40",
//     status: "online",
//   },
//   {
//     id: 4,
//     name: "Emily Brown",
//     image: "/placeholder.svg?height=40&width=40",
//     status: "offline",
//   },
//   {
//     id: 5,
//     name: "Alex Wilson",
//     image: "/placeholder.svg?height=40&width=40",
//     status: "online",
//   },
// ];

const LeftSidebar = () => {
  return (
    <aside className="space-y-6 p-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Friends</h2>
        <div className="flex flex-wrap gap-2">
          {friends.map((friend) => (
            <div key={friend.id} className="relative">
              <img
                src={friend.image}
                alt={friend.name}
                className="w-10 h-10 rounded-full"
              />
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                  friend.status === "online" ? "bg-green-500" : "bg-gray-300"
                }`}
              ></span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Chats</h2>
        <ul className="space-y-3">
          {friends.slice(0, 3).map((friend) => (
            <li key={friend.id}>
              <Link
                to={`/messages/${friend.id}`}
                className="flex items-center hover:bg-gray-100 p-2 rounded-lg transition duration-300"
              >
                <img
                  src={friend.image}
                  alt={friend.name}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div className="flex-grow">
                  <span className="font-medium">{friend.name}</span>
                  <p className="text-sm text-gray-500 truncate">
                    Hey, how are you feeling today?
                  </p>
                </div>
                <MessageCircle className="h-5 w-5 text-gray-400" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default LeftSidebar;
