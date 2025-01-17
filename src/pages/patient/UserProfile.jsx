import React from "react";
import { Link } from "react-router-dom";
import { doctor2, doctor5 } from "../../Assets/images";
// import { Calendar, MapPin, LinkIcon } from "lucide-react";

const UserProfile = () => {
  // This would typically come from your authentication state or API
  const user = {
    name: "John Doe",
    username: "@johndoe",
    bio: "Health enthusiast | Software developer | Yoga practitioner",
    location: "San Francisco, CA",
    website: "https://johndoe.com",
    joinDate: "Joined September 2021",
    following: 245,
    followers: 1024,
    profileImage: doctor2,
    coverImage: doctor5,
  };

  return (
    <div className="bg-white">
      {/* Cover Image */}
      <div className="h-48 w-full bg-gray-300 relative">
        <img
          src={user.coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile Section */}
      <div className="px-4 py-3 relative">
        {/* Profile Image */}
        <div className="absolute -top-16 left-4 border-4 border-white rounded-full">
          <img
            src={user.profileImage}
            alt={user.name}
            className="w-32 h-32 rounded-full"
          />
        </div>

        {/* Edit Profile Button */}
        <div className="flex justify-end">
          <Link
            to="/edit-profile"
            className="mt-4 px-4 py-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-100 transition duration-300"
          >
            Edit Profile
          </Link>
        </div>

        {/* User Info */}
        <div className="mt-8">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-600">{user.username}</p>
          <p className="mt-2">{user.bio}</p>
          <div className="flex items-center mt-2 text-gray-600">
            {/* <MapPin size={16} className="mr-2" /> */}
            <span>{user.location}</span>
          </div>
          <div className="flex items-center mt-1 text-gray-600">
            {/* <LinkIcon size={16} className="mr-2" /> */}
            <a
              href={user.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {user.website}
            </a>
          </div>
          <div className="flex items-center mt-1 text-gray-600">
            {/* <Calendar size={16} className="mr-2" /> */}
            <span>{user.joinDate}</span>
          </div>
        </div>

        {/* Following/Followers */}
        <div className="flex mt-4 space-x-4">
          <span>
            <strong>{user.following}</strong> Following
          </span>
          <span>
            <strong>{user.followers}</strong> Followers
          </span>
        </div>
      </div>

      {/* Posts or Health Updates would go here */}
      <div className="px-4 py-4 border-t">
        {/* This is where you'd map through the user's posts or health updates */}
        <p className="text-gray-600">No health updates yet.</p>
      </div>
    </div>
  );
};

export default UserProfile;
