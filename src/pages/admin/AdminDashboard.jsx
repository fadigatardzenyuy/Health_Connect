import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { Calendar, Clock, Users, Activity } from "lucide-react";
import AnalyticsChart from "../../components/AnalyricsChart";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Appointments",
      value: "28",
      icon: Calendar,
      color: "bg-blue-600",
    },
    {
      title: "Pending Approvals",
      value: "5",
      icon: Clock,
      color: "bg-blue-500",
    },
    {
      title: "Active Patients",
      value: "12",
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Consultations",
      value: "8",
      icon: Activity,
      color: "bg-purple-500",
    },
  ];

  const appointments = [
    {
      name: "John Doe",
      type: "General Checkup",
      time: "09:00 AM",
      status: "Pending",
    },
    {
      name: "Jane Smith",
      type: "Follow-up",
      time: "10:30 AM",
      status: "Approved",
    },
    {
      name: "Mike Johnson",
      type: "Consultation",
      time: "02:00 PM",
      status: "Pending",
    },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome Back, Dr. Smith
          </h1>
          <p className="text-gray-600">
            Here's your hospital dashboard overview
          </p>
        </div>
        <Typography variant="h6" className="text-gray-600">
          1/10/2025
        </Typography>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg mr-4`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <Typography color="textSecondary" gutterBottom>
                  {stat.title}
                </Typography>
                <Typography variant="h4">{stat.value}</Typography>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Chart */}
        <div className="lg:col-span-2">
          <AnalyticsChart />
        </div>

        {/* Today's Appointments */}
        <Card>
          <CardContent>
            <Typography variant="h6" className="mb-4">
              Today's Appointments
            </Typography>
            <div className="space-y-4">
              {appointments.map((appointment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <Typography variant="subtitle1" className="font-medium">
                      {appointment.name}
                    </Typography>
                    <Typography color="textSecondary">
                      {appointment.type}
                    </Typography>
                    <Typography color="textSecondary">
                      {appointment.time}
                    </Typography>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      appointment.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
            <Button variant="outlined" fullWidth className="mt-4">
              View All Appointments
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
