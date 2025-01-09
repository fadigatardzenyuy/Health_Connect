import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Onboarding = () => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 3000); // Show content after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-600">
      {!showContent ? (
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Health Connect</h1>
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white mx-auto"></div>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-8">
            Welcome to Health Connect
          </h1>
          <p className="text-xl text-white mb-8">
            Your journey to better health starts here
          </p>
          <div className="space-x-4">
            <Link
              to="/signup"
              className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition duration-300"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="bg-transparent text-white px-6 py-3 rounded-full font-semibold border border-white hover:bg-white hover:text-blue-600 transition duration-300"
            >
              Log In
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
