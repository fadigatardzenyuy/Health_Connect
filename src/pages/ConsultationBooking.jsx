import { Layout } from "@/components/Layout";
import { ConsultationBooking } from "@/components/ConsultationBooking";
import { HealthAssistant } from "@/components/AIFeatures/HealthAssistant";

const ConsultationBookingPage = () => {
  return (
    <Layout>
      <div className="col-span-8">
        <ConsultationBooking />
      </div>
      <div className="col-span-4">
        <HealthAssistant />
      </div>
    </Layout>
  );
};

export default ConsultationBookingPage;