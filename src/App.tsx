
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
import QuoteForm from './pages/dashboard/QuoteForm';

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
import Index from './pages/Index';
import NotFound from './pages/NotFound';

// Context Providers
import { ThemeProvider } from './contexts/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { PlanProvider } from './contexts/PlanContext';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PlanProvider>
          <ThemeProvider>
            <Router>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Dashboard routes - Company users */}
                <Route path="/dashboard" element={
                  <ProtectedRoute routeType="company">
                    <DashboardLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Dashboard />} />
                  <Route path="technicians" element={<Technicians />} />
                  <Route path="work-orders" element={<WorkOrders />} />
                  <Route path="work-orders/new" element={<CreateWorkOrder />} />
                  <Route path="work-orders/:id" element={<WorkOrderDetails />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="settings" element={<Settings />} />
                  
                  {/* Inventory routes */}
                  <Route path="inventory" element={<Inventory />} />
                  <Route path="inventory/new" element={<InventoryForm />} />
                  <Route path="inventory/:id" element={<InventoryForm />} />
                  
                  {/* Quotes routes */}
                  <Route path="quotes" element={<Quotes />} />
                  <Route path="quotes/new" element={<QuoteForm />} />
                  <Route path="quotes/:id" element={<QuoteForm />} />
                </Route>
                
                {/* Technician routes */}
                <Route path="/technician" element={
                  <ProtectedRoute routeType="technician">
                    <MobileLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<TechnicianDashboard />} />
                  <Route path="work-order/:id" element={<WorkOrderView />} />
                  <Route path="settings" element={<TechnicianSettings />} />
                  <Route path="inventory" element={<TechnicianInventory />} />
                  <Route path="quotes" element={<TechnicianQuotes />} />
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
