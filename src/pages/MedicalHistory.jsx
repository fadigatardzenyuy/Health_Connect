import { Layout } from "@/components/Layout";
import { MedicalHistoryForm } from "@/components/medical/MedicalHistoryForm";
import { MedicalHistoryList } from "@/components/medical/MedicalHistoryList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MedicalHistory = () => {
  return (
    <Layout>
      <div className="col-span-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Medical History</h1>
          <p className="text-muted-foreground">
            Track and manage your medical history records
          </p>
        </div>

        <Tabs defaultValue="view" className="space-y-4">
          <TabsList>
            <TabsTrigger value="view">View History</TabsTrigger>
            <TabsTrigger value="add">Add New Record</TabsTrigger>
          </TabsList>

          <TabsContent value="view">
            <Card>
              <CardHeader>
                <CardTitle>Medical History Records</CardTitle>
              </CardHeader>
              <CardContent>
                <MedicalHistoryList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>Add Medical Record</CardTitle>
              </CardHeader>
              <CardContent>
                <MedicalHistoryForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MedicalHistory;
