import React, { useState, useEffect } from "react";
import { supabase } from "../../utils/SupaBaseClient";
import LeftSidebar from "./components/LeftSidebar";
import MainContent from "./components/MainContent";
import RightSidebar from "./components/RightSidebar";

const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, []);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="lg:w-1/4 lg:sticky lg:top-20 lg:h-screen overflow-y-auto">
        <LeftSidebar />
      </div>
      <div className="lg:w-1/2 mx-auto px-4 max-w-3xl lg:w-mt-11 mt-11">
        <MainContent />
      </div>
      <div className="lg:w-1/4 lg:sticky lg:top-16 lg:h-screen overflow-y-auto">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Dashboard;
