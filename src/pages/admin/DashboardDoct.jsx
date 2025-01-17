import React from "react";
import { Card, CardContent, Typography, Button, Grid } from "@mui/material";
import { Calendar, Clock, Users, Activity } from "lucide-react";
import { Link } from "react-router-dom";
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
      color: "bg-yellow-500",
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
      id: 1,
      name: "John Doe",
      type: "General Checkup",
      time: "09:00 AM",
      status: "Pending",
    },
    {
      id: 2,
      name: "Jane Smith",
      type: "Follow-up",
      time: "10:30 AM",
      status: "Approved",
    },
    {
      id: 3,
      name: "Mike Johnson",
      type: "Consultation",
      time: "02:00 PM",
      status: "Pending",
    },
  ];

  return (
    <div>
      <Typography variant="h4" className="mb-6">
        Dashboard
      </Typography>

      <Grid container spacing={4} className="mb-8">
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card className="h-full">
              <CardContent className="flex items-center">
                <div className={`${stat.color} p-3 rounded-full mr-4`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <Typography variant="h5">{stat.value}</Typography>
                  <Typography color="textSecondary">{stat.title}</Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="mb-4">
                Analytics Overview
              </Typography>
              <AnalyticsChart />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="mb-4">
                Today's Appointments
              </Typography>
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
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
              <Button
                component={Link}
                to="/appointments"
                variant="outlined"
                fullWidth
                className="mt-4"
              >
                View All Appointments
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
