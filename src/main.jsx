// Import necessary libraries
import React from "react";
import ReactDOM from "react-dom/client"; // Change this import
import App from "./App";
// import "./index.css"; // Adjust the path as necessary

// Get the root element
const container = document.getElementById("app");

// Create a root
const root = ReactDOM.createRoot(container); // Use createRoot here

// Render your App
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
