
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Clipboard,
  BarChart3,
  Settings,
  Package,
  FileText,
  LogOut,
  User
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
};

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  const isMobile = useIsMobile();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
          isActive
            ? 'bg-muted text-primary'
            : 'hover:bg-muted/80 text-muted-foreground'
        }`
      }
    >
      {icon}
      {(!isCollapsed || isMobile) && <span>{label}</span>}
    </NavLink>
  );
};

const getInitials = (name: string) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const DashboardLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    signOut();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex">
        <Sidebar className="h-screen">
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
              <NavItem
                to="/dashboard"
                icon={<LayoutDashboard size={20} />}
                label="Dashboard"
              />
              <NavItem
                to="/dashboard/technicians"
                icon={<Users size={20} />}
                label="Técnicos"
              />
              <NavItem
                to="/dashboard/work-orders"
                icon={<Clipboard size={20} />}
                label="Ordens de Serviço"
              />
              <NavItem
                to="/dashboard/inventory"
                icon={<Package size={20} />}
                label="Estoque"
              />
              <NavItem
                to="/dashboard/quotes"
                icon={<FileText size={20} />}
                label="Orçamentos"
              />
              <NavItem
                to="/dashboard/reports"
                icon={<BarChart3 size={20} />}
                label="Relatórios"
              />
              <NavItem
                to="/dashboard/settings"
                icon={<Settings size={20} />}
                label="Configurações"
              />
            </div>
          </SidebarContent>
          
          <SidebarFooter>
            {isMobile && (
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut size={16} className="mr-2" />
                Sair
              </Button>
            )}
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-14 flex items-center gap-4 border-b bg-background px-4 lg:px-6">
            <div className="flex-1" />
            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>{getInitials(user?.email || '')}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <NavLink to="/dashboard/settings" className="flex items-center">
                      <User size={16} className="mr-2" />
                      Perfil
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                    <LogOut size={16} className="mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
