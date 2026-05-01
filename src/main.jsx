import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

import PrivateRoute from "./PrivateRoute.jsx";
import App from "./App.jsx";
import Login from "./login.jsx";
import Register from "./register.jsx";
import AdminDashboard from "./adminDashboard.jsx";
import AdminUsers from "./adminUsers.jsx";
import Volunteers from "./volunteers.jsx";
import Skills from "./skills.jsx";
import RoleManager from "./RoleManager.jsx";
import ResidentSpecialNeeds from "./ResidentSpecialNeeds.jsx";
import Addresses from "./Adress.jsx";
import MapPage from "./mapPage.jsx";
import Teams from "./Teams.jsx";
import Warehouses from "./warehouse.jsx";

// Her axios isteğine otomatik token ekle
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("aegis_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public routes — herkes erişebilir */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/map" element={<MapPage />} />

        {/* Admin only */}
        <Route
          path="/adminDashboard"
          element={
            <PrivateRoute allowedRoles={["Admin", "Calisan"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/adminUsers"
          element={
            <PrivateRoute allowedRoles={["Admin"]}>
              <AdminUsers />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/roles"
          element={
            <PrivateRoute allowedRoles={["Admin"]}>
              <RoleManager />
            </PrivateRoute>
          }
        />
        <Route
          path="/volunteers"
          element={
            <PrivateRoute allowedRoles={["Admin", "Calisan", "Gonullu"]}>
              <Volunteers />
            </PrivateRoute>
          }
        />
        <Route
          path="/skills"
          element={
            <PrivateRoute allowedRoles={["Admin"]}>
              <Skills />
            </PrivateRoute>
          }
        />
        <Route
          path="/addresses"
          element={
            <PrivateRoute allowedRoles={["Admin"]}>
              <Addresses />
            </PrivateRoute>
          }
        />
        <Route
          path="/teams"
          element={
            <PrivateRoute allowedRoles={["Admin", "Calisan"]}>
              <Teams />
            </PrivateRoute>
          }
        />
        <Route
          path="/residentspecialneeds"
          element={
            <PrivateRoute allowedRoles={["Admin", "Calisan"]}>
              <ResidentSpecialNeeds />
            </PrivateRoute>
          }
        />

        {/* Warehouse Manager + Admin */}
        <Route
          path="/warehouses"
          element={
            <PrivateRoute allowedRoles={["Admin", "WAREHOUSE_MANAGER"]}>
              <Warehouses />
            </PrivateRoute>
          }
        />

        {/* Gönüllü — kendi takımı */}
        <Route
          path="/my-team"
          element={
            <PrivateRoute allowedRoles={["Gonullu", "Admin"]}>
              <Teams />
            </PrivateRoute>
          }
        />

        {/* Ana sayfa → role göre yönlendir */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
