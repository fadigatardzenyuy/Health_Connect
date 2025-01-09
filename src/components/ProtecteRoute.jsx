import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth(); // Check if the user is signed in

  // Wait until Clerk has finished loading before checking auth status
  if (!isLoaded) {
    return <div>Loading...</div>; // Optionally show a loading state
  }

  // If the user is not signed in, redirect to the Sign In page
  return isSignedIn ? children : <Navigate to="/signin" />;
};

export default ProtectedRoute;
