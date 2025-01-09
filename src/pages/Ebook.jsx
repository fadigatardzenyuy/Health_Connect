import React, { useState } from "react";
import { Book, Download } from "lucide-react";

const EBookPurchase = () => {
  const [purchased, setPurchased] = useState(false);

  const handlePurchase = () => {
    // In a real application, this would integrate with a payment gateway
    setPurchased(true);
  };

  const handleDownload = () => {
    // In a real application, this would trigger the download of the eBook
    alert("eBook download started!");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 mt-4">
      <h2 className="text-2xl font-semibold mb-6">
        Hospital Information eBook
      </h2>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Book size={24} className="text-blue-500 mr-2" />
          <span className="text-lg font-medium">
            Comprehensive Guide to Our Hospital
          </span>
        </div>
        <span className="text-xl font-bold">$9.99</span>
      </div>
      <p className="text-gray-600 mb-6">
        This eBook provides detailed information about our hospital, including
        services, departments, doctors, and patient care guidelines. It's an
        essential resource for patients and their families.
      </p>
      {!purchased ? (
        <button
          onClick={handlePurchase}
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-blue-700 transition duration-300"
        >
          Purchase eBook
        </button>
      ) : (
        <button
          onClick={handleDownload}
          className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-green-700 transition duration-300 flex items-center justify-center"
        >
          <Download size={20} className="mr-2" />
          Download eBook
        </button>
      )}
    </div>
  );
};

export default EBookPurchase;
