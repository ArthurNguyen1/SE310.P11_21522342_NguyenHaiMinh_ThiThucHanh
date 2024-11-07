import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import EcommerceStore from "./pages/EcommerceStore";
import AdminDashboard from "./pages/AdminDashboard";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  // Mock authentication check for admin access
  const isAdmin = localStorage.getItem("isAdmin") === "true"; // Or use context/state

  return (
    <Router>
      <div className="App">
        {/* Toast container for notifications */}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

        <Routes>
          {/* Route for the main store */}
          <Route path="/store" element={<EcommerceStore />} />

          {/* Protected route for Admin Dashboard */}
          <Route 
            path="/admin" 
            element={isAdmin ? <AdminDashboard /> : <Navigate to="/store" />} 
          />

          {/* Redirect root to store */}
          <Route path="*" element={<Navigate to="/store" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
