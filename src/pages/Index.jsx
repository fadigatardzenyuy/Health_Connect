import { Layout } from "@/components/Layout";
import { Sidebar } from "@/components/Sidebar";
import { MainFeed } from "@/components/MainFeed";
import { AppointmentsSidebar } from "@/components/AppointmentsSidebar";

const Index = () => {
  return (
    <Layout>
      <div className="col-span-12 lg:col-span-3 xl:col-span-2">
        <Sidebar />
      </div>
      <div className="col-span-12 lg:col-span-6 xl:col-span-7">
        <MainFeed />
      </div>
      <div className="col-span-12 lg:col-span-3">
        <AppointmentsSidebar />
      </div>
    </Layout>
  );
};

export default Index;
