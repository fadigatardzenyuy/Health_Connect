import React, { useState } from "react";
import { Calendar, Clock, MapPin, CheckCircle, XCircle } from "lucide-react";

// interface Appointment {
//   id: number;
//   patientName: string;
//   date: string;
//   time: string;
//   location: string;
//   status: 'pending' | 'approved' | 'declined';
// }

const initialAppointments = [
  {
    id: 1,
    patientName: "John Doe",
    date: "June 15, 2023",
    time: "10:00 AM",
    location: "Main Hospital, Room 302",
    status: "pending",
  },
  {
    id: 2,
    patientName: "Jane Smith",
    date: "June 16, 2023",
    time: "2:30 PM",
    location: "Medical Center, Suite 105",
    status: "pending",
  },
  {
    id: 3,
    patientName: "Mike Johnson",
    date: "June 17, 2023",
    time: "11:15 AM",
    location: "Main Hospital, Room 205",
    status: "pending",
  },
];

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState(initialAppointments);

  const handleApprove = (id) => {
    setAppointments(
      appointments.map((app) =>
        app.id === id ? { ...app, status: "approved" } : app
      )
    );
  };

  const handleDecline = (id) => {
    setAppointments(
      appointments.map((app) =>
        app.id === id ? { ...app, status: "declined" } : app
      )
    );
  };

  const handleExtend = (id) => {
    // In a real application, this would open a modal or form to select a new date/time
    alert("Extend functionality would be implemented here.");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Doctor's Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Pending Appointments</h2>
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="border-b border-gray-200 py-4 last:border-b-0"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{appointment.patientName}</h3>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{appointment.date}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{appointment.time}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{appointment.location}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {appointment.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleApprove(appointment.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition duration-300"
                    >
                      <CheckCircle size={16} className="inline mr-1" /> Approve
                    </button>
                    <button
                      onClick={() => handleDecline(appointment.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition duration-300"
                    >
                      <XCircle size={16} className="inline mr-1" /> Decline
                    </button>
                    <button
                      onClick={() => handleExtend(appointment.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition duration-300"
                    >
                      Extend
                    </button>
                  </>
                )}
                {appointment.status === "approved" && (
                  <span className="text-green-500">Approved</span>
                )}
                {appointment.status === "declined" && (
                  <span className="text-red-500">Declined</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
