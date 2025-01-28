import { Layout } from "@/components/Layout";
import { EPrescription } from "@/components/Prescriptions/EPrescription";

const EPrescriptionsPage = () => {
  return (
    <Layout>
      <div className="col-span-12 lg:col-span-9">
        <EPrescription />
      </div>
    </Layout>
  );
};

export default EPrescriptionsPage;
