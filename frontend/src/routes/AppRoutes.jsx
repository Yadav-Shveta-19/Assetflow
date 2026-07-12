import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../layouts/AppLayout";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";
import Assets from "../pages/Assets";
import Allocations from "../pages/Allocations";
import Organization from "../pages/Organization";
import Bookings from "../pages/Bookings";
import Maintenance from "../pages/Maintenance";
import Audits from "../pages/Audits";
import Reports from "../pages/Reports";
import Activity from "../pages/Activity";
import NotFound from "../pages/NotFound";

const Protected = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-slate-500">Loading AssetFlow...</div>;
  return user ? <AppLayout /> : <Navigate to="/login" replace />;
};

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route element={<Protected />}>
          <Route index element={<Dashboard />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/allocations" element={<Allocations />} />
          <Route path="/organization" element={<Organization />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/audits" element={<Audits />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/activity" element={<Activity />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
