
import React from 'react';
import {
  LayoutDashboard,
  Users,
  Clipboard,
  BarChart3,
  Package,
  FileText,
  Settings,
} from 'lucide-react';

export const dashboardNavItems = [
  { to: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
  { to: "/technicians", icon: <Users size={20} />, label: "Técnicos" },
  { to: "/work-orders", icon: <Clipboard size={20} />, label: "Ordens de Serviço" },
  { to: "/inventory", icon: <Package size={20} />, label: "Estoque" },
  { to: "/quotes", icon: <FileText size={20} />, label: "Orçamentos" },
  { to: "/reports", icon: <BarChart3 size={20} />, label: "Relatórios" },
  { to: "/settings", icon: <Settings size={20} />, label: "Configurações" }
];
