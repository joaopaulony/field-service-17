
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
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useQuery } from '@tanstack/react-query';
import { getCompanyDetails } from '@/services/companyService';
import { Skeleton } from '@/components/ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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

const CompanyDisplay: React.FC = () => {
  const { data: company, isLoading } = useQuery({
    queryKey: ["company"],
    queryFn: getCompanyDetails,
  });

  if (isLoading) {
    return <Skeleton className="h-10 w-44" />;
  }

  return (
    <div className="flex items-center gap-2 p-2 px-3 rounded-lg profile-gradient">
      <Avatar className="h-8 w-8 border-2 border-white/30">
        <AvatarImage src={company?.logo_url || ""} />
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
          {getInitials(company?.name || '?')}
        </AvatarFallback>
      </Avatar>
      <span className="font-medium truncate max-w-[160px]">
        {company?.name || "Empresa"}
      </span>
    </div>
  );
};

const DashboardLayout: React.FC = () => {
  const { signOut } = useAuth();
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
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              
              <Popover>
                <PopoverTrigger asChild>
                  <div className="cursor-pointer">
                    <CompanyDisplay />
                  </div>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-60 p-2">
                  <div className="flex justify-end">
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={handleLogout} 
                      className="flex items-center gap-1"
                    >
                      <LogOut size={16} />
                      <span>Sair</span>
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
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
