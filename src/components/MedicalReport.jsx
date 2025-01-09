import React, { useState } from "react";
import { FileText, Download } from "lucide-react";

// interface Report {
//   id: number;
//   title: string;
//   doctor: string;
//   date: string;
//   price: number;
// }

const MedicalReportPurchase = () => {
  const [reports, setReports] = useState([
    {
      id: 1,
      title: "General Health Checkup Report",
      doctor: "Dr. Sarah Johnson",
      date: "2023-06-15",
      price: 25,
    },
    {
      id: 2,
      title: "Cardiology Consultation Report",
      doctor: "Dr. Michael Brown",
      date: "2023-06-20",
      price: 35,
    },
    {
      id: 3,
      title: "Dermatology Examination Report",
      doctor: "Dr. Emily Davis",
      date: "2023-06-22",
      price: 30,
    },
  ]);

  const [purchasedReports, setPurchasedReports] = useState([]);

  const handlePurchase = (reportId) => {
    setPurchasedReports([...purchasedReports, reportId]);
  };

  const handleDownload = (reportId) => {
    // In a real application, this would trigger the download of the report
    alert(`Downloading report ${reportId}`);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 mt-4">
      <h2 className="text-2xl font-semibold mb-6">Medical Reports</h2>
      {reports.map((report) => (
        <div
          key={report.id}
          className="border-b border-gray-200 py-4 last:border-b-0"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <FileText size={24} className="text-primary mr-2" />
              <span className="text-lg font-medium">{report.title}</span>
            </div>
            <span className="text-xl font-bold">
              ${report.price.toFixed(2)}
            </span>
          </div>
          <p className="text-gray-600 mb-2">Doctor: {report.doctor}</p>
          <p className="text-gray-600 mb-4">Date: {report.date}</p>
          {!purchasedReports.includes(report.id) ? (
            <button
              onClick={() => handlePurchase(report.id)}
              className="w-full bg-primary text-white font-semibold py-2 px-4 rounded-full hover:bg-green-600 transition duration-300"
            >
              Purchase Report
            </button>
          ) : (
            <button
              onClick={() => handleDownload(report.id)}
              className="w-full bg-secondary text-white font-semibold py-2 px-4 rounded-full hover:bg-blue-600 transition duration-300 flex items-center justify-center"
            >
              <Download size={20} className="mr-2" />
              Download Report
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default MedicalReportPurchase;
