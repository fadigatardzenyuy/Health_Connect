import { Layout } from "@/components/Layout";
import { ChatInterface } from "@/components/Messaging/ChatInterface";

const Messages = () => {
  return (
    <Layout>
      <div className="col-span-12 md:col-span-8 md:col-start-3">
        <ChatInterface />
      </div>
    </Layout>
  );
};

export default Messages;
