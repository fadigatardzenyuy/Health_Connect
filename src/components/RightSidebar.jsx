import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, ChevronRight } from "lucide-react";

const appointments = [
  {
    id: 1,
    doctor: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    date: "June 15, 2023",
    time: "10:00 AM",
    location: "Main Hospital, Room 302",
  },
  {
    id: 2,
    doctor: "Dr. Michael Brown",
    specialty: "Dermatologist",
    date: "June 20, 2023",
    time: "2:30 PM",
    location: "Medical Center, Suite 105",
  },
];

const hospitalUpdates = [
  {
    id: 1,
    title: "New COVID-19 vaccination center opened",
    content: "Book your appointment now!",
  },
  {
    id: 2,
    title: "Extended hours for Emergency Services",
    content: "Now open 24/7 for your convenience.",
  },
  {
    id: 3,
    title: "Free health check-up camp",
    content: "Join us this Saturday for a comprehensive health screening.",
  },
];

const RightSidebar = () => {
  return (
    <aside className="space-y-6 p-4">
      <div className="bg-white rounded-lg shadow p-4">
        <Link to="/book-appointment" className="block w-full">
          <button className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-blue-700 transition duration-300">
            Book Appointment
          </button>
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
          <Link
            to="/appointments"
            className="text-blue-500 hover:underline flex items-center"
          >
            View all <ChevronRight size={16} />
          </Link>
        </div>
        {appointments.map((appointment) => (
          <div key={appointment.id} className="mb-4 last:mb-0">
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 text-blue-600 mr-2" />
              <p className="font-semibold">{appointment.doctor}</p>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              {appointment.specialty}
            </p>
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <Clock className="h-4 w-4 mr-1" />
              <span>
                {appointment.date} at {appointment.time}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{appointment.location}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Hospital Updates</h2>
        <div className="space-y-2">
          {hospitalUpdates.map((update) => (
            <Link
              key={update.id}
              to={`/updates/${update.id}`}
              className="block hover:bg-gray-100 p-2 rounded-lg transition duration-300"
            >
              <p className="text-sm">
                <span className="font-semibold">{update.title}:</span>{" "}
                {update.content}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
