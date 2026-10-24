import React from "react";
import { Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PendingAstrologers from "./pages/PendingAstrologers";
import AllAstrologers from "./pages/AllAstrologers";
import Appointments from "./pages/Appointments";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />

          <Route
            path="/astrologers/pending"
            element={
              <ProtectedRoute allow={["superadmin"]}>
                <PendingAstrologers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/astrologers"
            element={
              <ProtectedRoute allow={["superadmin"]}>
                <AllAstrologers />
              </ProtectedRoute>
            }
          />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allow={["astrologer", "superadmin"]}>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </AppProvider>
  );
}
