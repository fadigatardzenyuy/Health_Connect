import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Phone, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AudioConsultation = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="col-span-12 bg-white p-6 rounded-lg shadow-sm">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-center space-y-4">
          <Phone className="w-16 h-16 mx-auto text-primary" />
          <h1 className="text-2xl font-bold">Audio Consultation</h1>
          <p className="text-muted-foreground">
            Talk to your doctor through a secure voice call.
          </p>
          <Button size="lg" className="mt-4">
            Start Voice Call
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default AudioConsultation;
