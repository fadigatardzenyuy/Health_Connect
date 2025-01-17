import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", appointments: 65, consultations: 28 },
  { month: "Feb", appointments: 59, consultations: 48 },
  { month: "Mar", appointments: 80, consultations: 40 },
  { month: "Apr", appointments: 81, consultations: 47 },
  { month: "May", appointments: 56, consultations: 36 },
  { month: "Jun", appointments: 55, consultations: 27 },
];

export default function AnalyticsChart() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" className="mb-4">
          Appointments & Consultations Analytics
        </Typography>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="appointments"
                stroke="#0F52BA"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="consultations"
                stroke="#147AFC"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
