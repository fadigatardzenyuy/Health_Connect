import { Layout } from "@/components/Layout";
import { ConsultationBooking } from "@/components/ConsultationBooking";
import { HealthAssistant } from "@/components/AIFeatures/HealthAssistant";

const ConsultationBookingPage = () => {
  return (
    <Layout>
      <div className="col-span-8">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-xl mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Book Your Medical Consultation
          </h1>
          <p className="text-gray-600">
            Schedule a video consultation with qualified doctors from the
            comfort of your home
          </p>
        </div>
        <ConsultationBooking />
      </div>
      <div className="col-span-4">
        <HealthAssistant />
      </div>
    </Layout>
  );
};

export default ConsultationBookingPage;
