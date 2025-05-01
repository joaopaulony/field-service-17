
import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Clipboard, LayoutDashboard, LogOut, Menu, Settings, Users } from 'lucide-react';
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
import { useAuth } from '@/contexts/AuthContext';

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };
  
  // Função para obter as iniciais do usuário
  const getInitials = (email: string) => {
    if (!email) return 'FS';
    const parts = email.split('@');
    return parts[0].substring(0, 2).toUpperCase();
  };

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
      <div className="hidden lg:flex flex-col w-64 bg-[#0D1525] text-white">
        <div className="p-4 border-b border-border">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="bg-primary rounded-md p-1">
              <Clipboard size={20} className="text-white" />
            </div>
            <span className="font-semibold text-lg text-white">FieldService</span>
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
              <Button variant="ghost" className="w-full flex items-center justify-between px-3 text-white">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user ? getInitials(user.email || "") : "FS"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">Empresa Demo</p>
                    <p className="text-xs text-gray-400">Plano Gratuito</p>
                  </div>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <Settings size={16} className="mr-2" />
                <span>Minha Conta</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut size={16} className="mr-2" />
                <span>Sair</span>
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
            <SheetContent side="left" className="w-64 p-0 bg-[#0D1525] text-white">
              <div className="p-4 border-b border-border">
                <Link to="/dashboard" className="flex items-center gap-2">
                  <div className="bg-primary rounded-md p-1">
                    <Clipboard size={20} className="text-white" />
                  </div>
                  <span className="font-semibold text-lg text-white">FieldService</span>
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
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user ? getInitials(user.email || "") : "FS"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-white">Empresa Demo</p>
                    <p className="text-xs text-gray-400">Plano Gratuito</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="justify-start" asChild>
                    <Link to="/dashboard/settings">
                      <Settings size={16} className="mr-2" />
                      <span>Minha Conta</span>
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="justify-start"
                    onClick={handleSignOut}
                  >
                    <LogOut size={16} className="mr-2" />
                    <span>Sair</span>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </header>
        
        {/* Page content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
