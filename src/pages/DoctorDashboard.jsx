import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Users, 
  Clock, 
  Activity,
  Calendar as CalendarIcon,
  User
} from "lucide-react";

const DoctorDashboard = () => {
  const stats = [
    {
      title: "Total Patients",
      value: "2,420",
      icon: Users,
    },
    {
      title: "Upcoming Appointments",
      value: "15",
      icon: Clock,
    },
    {
      title: "Today's Consultations",
      value: "8",
      icon: Calendar,
    },
    {
      title: "Active Cases",
      value: "48",
      icon: Activity,
    },
  ];

  return (
    <Layout>
      <div className="col-span-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Doctor Dashboard</h1>
          <p className="text-muted-foreground">Manage your patients and appointments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mr-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="appointments" className="w-full">
          <TabsList>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Patient Name {i + 1}</h4>
                          <p className="text-sm text-muted-foreground">General Checkup</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarIcon className="w-4 h-4" />
                        <span>Today, 2:00 PM</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle>Patient List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Patient Name {i + 1}</h4>
                          <p className="text-sm text-muted-foreground">Last visit: 3 days ago</p>
                        </div>
                      </div>
                      <button className="text-sm text-primary hover:underline">
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="consultations">
            <Card>
              <CardHeader>
                <CardTitle>Recent Consultations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Patient Name {i + 1}</h4>
                          <p className="text-sm text-muted-foreground">Video Consultation</p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Completed on March 15, 2024
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DoctorDashboard;