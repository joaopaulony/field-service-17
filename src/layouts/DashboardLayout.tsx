
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const DashboardLayout = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const getInitials = (name: string): string => {
    if (!name) return "??";
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex">
        <Sidebar className="h-screen">
          <SidebarContent>
            <div className="flex flex-col h-full">
              <div className="p-4 flex items-center justify-center">
                <Link to="/dashboard" className="flex items-center gap-2 font-bold">
                  FieldService
                </Link>
              </div>

              <div className="flex-grow p-4">
                <ul className="space-y-2">
                  <li>
                    <Link to="/dashboard" className="block px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard/work-orders" className="block px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                      Ordens de Serviço
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard/technicians" className="block px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                      Técnicos
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard/reports" className="block px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                      Relatórios
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard/settings" className="block px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                      Configurações
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="p-4 border-t border-border">
                <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4" />
                  Sair
                </Button>
              </div>
            </div>
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="border-b border-border h-14 flex items-center px-6 justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger>
                <Menu className="w-6 h-6" />
              </SidebarTrigger>
              <Link to="/dashboard" className="font-bold">
                Dashboard
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>{getInitials(user?.email || '')}</AvatarFallback>
              </Avatar>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
