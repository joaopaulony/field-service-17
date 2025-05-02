
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { NavItem } from './NavItem';
import { dashboardNavItems } from '@/data/dashboardNavigation';

export const DashboardSidebar: React.FC = () => {
  return (
    <Sidebar className="h-screen hidden md:flex">
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold">
            OS
          </div>
          <span className="font-semibold">OrderSys</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <div className="space-y-1">
          {dashboardNavItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </div>
      </SidebarContent>
      
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
};
