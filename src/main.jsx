import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Deneme from "./deneme.jsx";
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

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/app" element={<App />} />
        <Route path="/deneme" element={<Deneme />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/adminUsers" element={<AdminUsers />} />
        <Route path="/volunteers" element={<Volunteers />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/admin/roles" element={<RoleManager />} />
        <Route path="/residentspecialneeds" element={<ResidentSpecialNeeds />} />
        <Route path="/addresses" element={<Addresses />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);