
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Páginas
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import PageNotFound from './pages/PageNotFound';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard
import Dashboard from './pages/dashboard/Dashboard';
import WorkOrders from './pages/dashboard/WorkOrders';
import WorkOrderDetails from './pages/dashboard/WorkOrderDetails';
import CreateWorkOrder from './pages/dashboard/CreateWorkOrder';
import Technicians from './pages/dashboard/Technicians';
import Inventory from './pages/dashboard/Inventory';
import InventoryForm from './pages/dashboard/InventoryForm';
import Quotes from './pages/dashboard/Quotes';
import QuoteForm from './pages/dashboard/QuoteForm';
import Reports from './pages/dashboard/Reports';
import Settings from './pages/dashboard/Settings';

// Technician
import TechnicianDashboard from './pages/technician/TechnicianDashboard';
import TechnicianWorkOrders from './pages/technician/TechnicianWorkOrders';
import WorkOrderView from './pages/technician/WorkOrderView';
import TechnicianInventory from './pages/technician/TechnicianInventory';
import TechnicianQuotes from './pages/technician/TechnicianQuotes';
import TechnicianSettings from './pages/technician/TechnicianSettings';

// Blog
import BlogPage from './pages/blog/BlogPage';
import BlogPostPage from './pages/blog/BlogPostPage';
import BlogAdminPage from './pages/blog/admin/BlogAdminPage';
import BlogNewPostPage from './pages/blog/admin/BlogNewPostPage';
import BlogEditPostPage from './pages/blog/admin/BlogEditPostPage';

import DashboardLayout from './layouts/DashboardLayout';
import MobileLayout from './layouts/MobileLayout';
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Blog */}
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              
              {/* Admin Blog */}
              <Route path="/admin/blog" element={<ProtectedRoute><BlogAdminPage /></ProtectedRoute>} />
              <Route path="/admin/blog/novo" element={<ProtectedRoute><BlogNewPostPage /></ProtectedRoute>} />
              <Route path="/admin/blog/editar/:id" element={<ProtectedRoute><BlogEditPostPage /></ProtectedRoute>} />
              
              {/* Dashboard */}
              <Route element={<ProtectedRoute routeType="company" />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/work-orders" element={<WorkOrders />} />
                  <Route path="/work-orders/:id" element={<WorkOrderDetails />} />
                  <Route path="/work-orders/new" element={<CreateWorkOrder />} />
                  <Route path="/technicians" element={<Technicians />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/inventory/new" element={<InventoryForm />} />
                  <Route path="/inventory/edit/:id" element={<InventoryForm />} />
                  <Route path="/quotes" element={<Quotes />} />
                  <Route path="/quotes/new" element={<QuoteForm />} />
                  <Route path="/quotes/edit/:id" element={<QuoteForm />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
              </Route>
              
              {/* Technician */}
              <Route element={<ProtectedRoute routeType="technician" />}>
                <Route element={<MobileLayout />}>
                  <Route path="/technician" element={<TechnicianDashboard />} />
                  <Route path="/technician/work-orders" element={<TechnicianWorkOrders />} />
                  <Route path="/technician/work-orders/:id" element={<WorkOrderView />} />
                  <Route path="/technician/inventory" element={<TechnicianInventory />} />
                  <Route path="/technician/quotes" element={<TechnicianQuotes />} />
                  <Route path="/technician/settings" element={<TechnicianSettings />} />
                </Route>
              </Route>
              
              <Route path="/404" element={<PageNotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            <Toaster />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
