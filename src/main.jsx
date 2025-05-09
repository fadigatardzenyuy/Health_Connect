import React from "react";
import ReactDOM from "react-dom/client"; // Change this import
import App from "./App";

// Get the root element
const container = document.getElementById("app");

// Create a root
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
