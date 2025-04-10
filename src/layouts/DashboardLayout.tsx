
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ChevronDown, Clipboard, Home, LayoutDashboard, LogOut, Menu, Settings, UserPlus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
        isActive(to) 
          ? 'bg-primary text-primary-foreground' 
          : 'hover:bg-muted'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar for desktop */}
      <div className="hidden lg:flex flex-col w-64 bg-sidebar border-r border-border">
        <div className="p-4 border-b border-border">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="bg-primary rounded-md p-1">
              <Clipboard size={20} className="text-white" />
            </div>
            <span className="font-semibold text-lg text-sidebar-foreground">FieldService</span>
          </Link>
        </div>
        
        <div className="flex-1 py-6 px-3 space-y-1">
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/dashboard/work-orders" icon={Clipboard} label="Ordens de Serviço" />
          <NavItem to="/dashboard/technicians" icon={Users} label="Técnicos" />
          <NavItem to="/dashboard/settings" icon={Settings} label="Configurações" />
        </div>
        
        <div className="p-4 border-t border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full flex items-center justify-between px-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">FS</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-medium text-sidebar-foreground">Empresa Demo</p>
                    <p className="text-xs text-sidebar-foreground/70">Plano Gratuito</p>
                  </div>
                </div>
                <ChevronDown size={16} className="text-sidebar-foreground/70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <Settings size={16} className="mr-2" />
                <span>Minha Conta</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/login" className="flex items-center cursor-pointer">
                  <LogOut size={16} className="mr-2" />
                  <span>Sair</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-border">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="bg-primary rounded-md p-1">
              <Clipboard size={20} className="text-white" />
            </div>
            <span className="font-semibold text-lg">FieldService</span>
          </Link>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="p-4 border-b border-border">
                <Link to="/dashboard" className="flex items-center gap-2">
                  <div className="bg-primary rounded-md p-1">
                    <Clipboard size={20} className="text-white" />
                  </div>
                  <span className="font-semibold text-lg">FieldService</span>
                </Link>
              </div>
              
              <div className="py-6 px-3 space-y-1">
                <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                <NavItem to="/dashboard/work-orders" icon={Clipboard} label="Ordens de Serviço" />
                <NavItem to="/dashboard/technicians" icon={Users} label="Técnicos" />
                <NavItem to="/dashboard/settings" icon={Settings} label="Configurações" />
              </div>
              
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">FS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Empresa Demo</p>
                    <p className="text-xs text-muted-foreground">Plano Gratuito</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="justify-start" asChild>
                    <Link to="/dashboard/settings">
                      <Settings size={16} className="mr-2" />
                      <span>Minha Conta</span>
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start" asChild>
                    <Link to="/login">
                      <LogOut size={16} className="mr-2" />
                      <span>Sair</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </header>
        
        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
