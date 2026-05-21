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
import Announcements from "./announcements.jsx";
import Home from "./home.jsx";
import Requests from "./requests.jsx";
import Assignments from "./assignments.jsx";
import VolunteerRegister from "./volunteerRegister.jsx";
import Profile from "./Profile.jsx";
import VolunteerDashboard from "./Volunteerdashboard.jsx";
import DepremzedeDashboard from "./depremzedeDashboard.jsx";
import WarehouseMap from "./warehouseMap.jsx";
import AuditLog from "./auditLog.jsx";


axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("aegis_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/map" element={<MapPage />} />

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
        <Route
          path="/warehouses"
          element={
            <PrivateRoute allowedRoles={["Admin", "WAREHOUSE_MANAGER"]}>
              <Warehouses />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-team"
          element={
            <PrivateRoute allowedRoles={["Gonullu", "Admin"]}>
              <Teams />
            </PrivateRoute>
          }
        />
        <Route
          path="/volunteer-dashboard"
          element={
            <PrivateRoute allowedRoles={["Gonullu"]}>
              <VolunteerDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/home"
          element={
            <PrivateRoute
              allowedRoles={[
                "Admin",
                "Calisan",
                "Gonullu",
                "Depremzede",
                "WAREHOUSE_MANAGER",
                "User",
              ]}
            >
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/requests"
          element={
            <PrivateRoute
              allowedRoles={[
                "Admin",
                "Calisan",
                "Gonullu",
                "Depremzede",
                "WAREHOUSE_MANAGER",
              ]}
            >
              <Requests />
            </PrivateRoute>
          }
        />
        <Route
          path="/assignments"
          element={
            <PrivateRoute allowedRoles={["Admin", "Calisan"]}>
              <Assignments />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute
              allowedRoles={[
                "Admin",
                "Calisan",
                "Gonullu",
                "Depremzede",
                "WAREHOUSE_MANAGER",
                "User",
              ]}
            >
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/audit-logs"
          element={
            <PrivateRoute allowedRoles={["Admin"]}>
              <AuditLog />
            </PrivateRoute>
          }
        />
        <Route
          path="/volunteer-register"
          element={
            <PrivateRoute allowedRoles={["User", "Gonullu"]}>
              <VolunteerRegister />
            </PrivateRoute>
          }
        />
        <Route
          path="/depremzede-dashboard"
          element={
            <PrivateRoute allowedRoles={["Depremzede"]}>
              <DepremzedeDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/warehouse-map"
          element={
            <PrivateRoute allowedRoles={["Admin", "WAREHOUSE_MANAGER"]}>
              <WarehouseMap />
            </PrivateRoute>
          }
        />
        <Route
          path="/announcements"
          element={
            <PrivateRoute
              allowedRoles={[
                "Admin",
                "Calisan",
                "Gonullu",
                "Depremzede",
                "WAREHOUSE_MANAGER",
                "User",
              ]}
            >
              <Announcements />
            </PrivateRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
