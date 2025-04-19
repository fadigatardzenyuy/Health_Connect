import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { VideoIcon, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VideoConsultation = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="col-span-12 bg-white p-6 rounded-lg shadow-sm">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-center space-y-4">
          <VideoIcon className="w-16 h-16 mx-auto text-primary" />
          <h1 className="text-2xl font-bold">Video Consultation</h1>
          <p className="text-muted-foreground">
            Connect with your doctor face-to-face through secure video call.
          </p>
          <Button size="lg" className="mt-4">
            Start Video Call
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default VideoConsultation;
