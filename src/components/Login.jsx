import { SignIn } from "@clerk/clerk-react";
import React from "react";

const CustomSignIn = () => {
  return (
    <SignIn
      appearance={{
        elements: {
          card: "bg-white shadow-lg rounded-lg p-6", // Customize card styles
          button: "bg-blue-600 text-white hover:bg-blue-700", // Customize button styles
          input: "border border-gray-300 rounded-md p-2 w-full", // Customize input styles
        },
      }}
      // You can also provide other props here
    />
  );
};

const SignInPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <CustomSignIn />
    </div>
  );
};

export default SignInPage;
