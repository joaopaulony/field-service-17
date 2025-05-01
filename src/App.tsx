import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import MobileLayout from './layouts/MobileLayout';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import Technicians from './pages/dashboard/Technicians';
import WorkOrders from './pages/dashboard/WorkOrders';
import WorkOrderDetails from './pages/dashboard/WorkOrderDetails';
import CreateWorkOrder from './pages/dashboard/CreateWorkOrder';
import Reports from './pages/dashboard/Reports';
import Settings from './pages/dashboard/Settings';
import Inventory from './pages/dashboard/Inventory';
import InventoryForm from './pages/dashboard/InventoryForm';
import Quotes from './pages/dashboard/Quotes';

// Technician Pages
import TechnicianDashboard from './pages/technician/TechnicianDashboard';
import WorkOrderView from './pages/technician/WorkOrderView';
import TechnicianSettings from './pages/technician/TechnicianSettings';
import TechnicianInventory from './pages/technician/TechnicianInventory';
import TechnicianQuotes from './pages/technician/TechnicianQuotes';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Other Pages
import { Index } from './pages/Index';
import NotFound from './pages/NotFound';

// Context Providers
import { ThemeProvider } from './contexts/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { PlanProvider } from './contexts/PlanContext';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PlanProvider>
          <ThemeProvider defaultTheme="light" storageKey="ui-theme">
            <Router>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Dashboard routes */}
                <Route element={<ProtectedRoute routeType="company" />}>
                  <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard/technicians" element={<Technicians />} />
                    <Route path="/dashboard/work-orders" element={<WorkOrders />} />
                    <Route path="/dashboard/work-orders/new" element={<CreateWorkOrder />} />
                    <Route path="/dashboard/work-orders/:id" element={<WorkOrderDetails />} />
                    <Route path="/dashboard/reports" element={<Reports />} />
                    <Route path="/dashboard/settings" element={<Settings />} />
                    
                    {/* Inventory routes */}
                    <Route path="/dashboard/inventory" element={<Inventory />} />
                    <Route path="/dashboard/inventory/new" element={<InventoryForm />} />
                    <Route path="/dashboard/inventory/:id" element={<InventoryForm />} />
                    
                    {/* Quotes routes */}
                    <Route path="/dashboard/quotes" element={<Quotes />} />
                  </Route>
                </Route>
                
                {/* Technician routes */}
                <Route element={<ProtectedRoute routeType="technician" />}>
                  <Route element={<MobileLayout />}>
                    <Route path="/technician" element={<TechnicianDashboard />} />
                    <Route path="/technician/work-order/:id" element={<WorkOrderView />} />
                    <Route path="/technician/settings" element={<TechnicianSettings />} />
                    <Route path="/technician/inventory" element={<TechnicianInventory />} />
                    <Route path="/technician/quotes" element={<TechnicianQuotes />} />
                  </Route>
                </Route>
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
            <Toaster />
          </ThemeProvider>
        </PlanProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
