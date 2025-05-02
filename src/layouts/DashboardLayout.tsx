
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Clipboard,
  BarChart3,
  Package,
  FileText,
  LogOut,
  User,
  Settings,
  ChevronDown
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
                <DropdownMenuTrigger className="focus:outline-none group">
                  <div className="flex items-center gap-2 p-1 px-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 border border-purple-200/50 dark:border-purple-800/50 hover:shadow-md transition-all duration-200">
                    <Avatar className="h-8 w-8 border-2 border-white/30">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                        {getInitials(user?.email || '')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium hidden md:block pr-1">
                      {user?.email?.split('@')[0] || 'Usuário'}
                    </span>
                    <ChevronDown size={14} className="opacity-70 group-data-[state=open]:rotate-180 transition-transform" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2">
                  <div className="flex flex-col p-3 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 rounded-md mb-2">
                    <span className="font-medium">{user?.email?.split('@')[0] || 'Usuário'}</span>
                    <span className="text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <NavLink to="/dashboard/settings" className="flex items-center gap-2 py-2">
                      <Settings size={16} />
                      Configurações
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer" onClick={handleLogout}>
                    <LogOut size={16} className="mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 py-6 lg:px-8 xl:px-10 max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
