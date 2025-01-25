import { SignUp } from "@clerk/clerk-react";
import React from "react";

const SignUpPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <SignUp />
    </div>
  );
};

export default SignUpPage;
