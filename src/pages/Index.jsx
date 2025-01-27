import { Layout } from "@/components/Layout";
import { Sidebar } from "@/components/Sidebar";
import { MainFeed } from "@/components/MainFeed";
import { AppointmentsSidebar } from "@/components/AppointmentsSidebar";

const Index = () => {
  return (
    <Layout>
      <Sidebar />
      <MainFeed />
      <AppointmentsSidebar />
    </Layout>
  );
};

export default Index;