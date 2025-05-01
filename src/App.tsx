
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PlanProvider } from "./contexts/PlanContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";
import MobileLayout from "./layouts/MobileLayout";

// Main pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Dashboard pages
import Dashboard from "./pages/dashboard/Dashboard";
import WorkOrders from "./pages/dashboard/WorkOrders";
import CreateWorkOrder from "./pages/dashboard/CreateWorkOrder";
import Technicians from "./pages/dashboard/Technicians";
import WorkOrderDetails from "./pages/dashboard/WorkOrderDetails";
import Settings from "./pages/dashboard/Settings";

// Technician pages
import TechnicianDashboard from "./pages/technician/TechnicianDashboard";
import WorkOrderView from "./pages/technician/WorkOrderView";
import TechnicianSettings from "./pages/technician/TechnicianSettings";

// Reports page
import Reports from "./pages/dashboard/Reports";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <PlanProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Admin Dashboard Routes */}
              <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/work-orders" element={<WorkOrders />} />
                <Route path="/dashboard/work-orders/create" element={<CreateWorkOrder />} />
                <Route path="/dashboard/work-orders/:id" element={<WorkOrderDetails />} />
                <Route path="/dashboard/technicians" element={<Technicians />} />
                <Route path="/dashboard/reports" element={<Reports />} />
                <Route path="/dashboard/settings" element={<Settings />} />
              </Route>
              
              {/* Technician Mobile Routes */}
              <Route element={<ProtectedRoute><MobileLayout /></ProtectedRoute>}>
                <Route path="/tech" element={<TechnicianDashboard />} />
                <Route path="/tech/orders/:id" element={<WorkOrderView />} />
                <Route path="/tech/settings" element={<TechnicianSettings />} />
              </Route>
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </PlanProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
