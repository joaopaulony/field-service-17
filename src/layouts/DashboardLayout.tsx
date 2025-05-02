
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
  Menu,
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
  SidebarTrigger
} from '@/components/ui/sidebar';
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
            ? 'bg-accent text-primary'
            : 'hover:bg-muted/80 text-muted-foreground'
        }`
      }
    >
      {icon}
      {(!isCollapsed || isMobile) && <span>{label}</span>}
    </NavLink>
  );
};

const MobileNavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
          isActive
            ? 'bg-accent text-primary'
            : 'hover:bg-muted/80 text-muted-foreground'
        }`
      }
    >
      {icon}
      <span>{label}</span>
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

  const navItems = [
    { to: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/dashboard/technicians", icon: <Users size={20} />, label: "Técnicos" },
    { to: "/dashboard/work-orders", icon: <Clipboard size={20} />, label: "Ordens de Serviço" },
    { to: "/dashboard/inventory", icon: <Package size={20} />, label: "Estoque" },
    { to: "/dashboard/quotes", icon: <FileText size={20} />, label: "Orçamentos" },
    { to: "/dashboard/reports", icon: <BarChart3 size={20} />, label: "Relatórios" }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Desktop Sidebar */}
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
              {navItems.map((item) => (
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

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-14 flex items-center gap-4 border-b bg-background px-4 lg:px-6">
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <div className="flex items-center gap-2 p-2 mb-6">
                  <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    OS
                  </div>
                  <span className="font-semibold">OrderSys</span>
                </div>
                
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <MobileNavItem
                      key={item.to}
                      to={item.to}
                      icon={item.icon}
                      label={item.label}
                    />
                  ))}
                </div>
              </SheetContent>
            </Sheet>
            
            {/* Desktop sidebar trigger */}
            <SidebarTrigger className="hidden md:flex" />
            
            <div className="flex-1" />
            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none group">
                  <div className="flex items-center gap-2 p-1 px-2 rounded-full profile-gradient border border-blue-200/50 dark:border-blue-800/50 hover:shadow-md transition-all duration-200">
                    <Avatar className="h-8 w-8 border-2 border-white/30">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
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
                  <div className="flex flex-col p-3 profile-gradient rounded-md mb-2">
                    <span className="font-medium">{user?.email?.split('@')[0] || 'Usuário'}</span>
                    <span className="text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                  <DropdownMenuSeparator />
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
