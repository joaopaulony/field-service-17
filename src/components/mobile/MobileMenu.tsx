
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Package, 
  FileText, 
  User, 
  Settings,
  LogOut
} from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

interface MobileMenuProps {
  triggerElement: React.ReactNode;
  technicianName?: string;
}

const MobileMenu = ({ triggerElement, technicianName = '' }: MobileMenuProps) => {
  const { user, signOut } = useAuth();

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {triggerElement}
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <div className="flex items-center gap-2 p-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold">
              OS
            </div>
            <SheetTitle>OrderSys</SheetTitle>
          </div>
        </SheetHeader>
        
        <Separator className="my-4" />
        
        <div className="profile-gradient rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-white/30">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                {getInitials(technicianName || user?.email || '')}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{technicianName || user?.email?.split('@')[0]}</span>
              <span className="text-xs text-muted-foreground">{user?.email}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-1">
          <NavLink
            to="/technician"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 ${
                isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`
            }
            end
          >
            <Home className="h-5 w-5" />
            <span>Início</span>
          </NavLink>
          
          <NavLink
            to="/technician/inventory"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 ${
                isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`
            }
          >
            <Package className="h-5 w-5" />
            <span>Estoque</span>
          </NavLink>
          
          <NavLink
            to="/technician/quotes"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 ${
                isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`
            }
          >
            <FileText className="h-5 w-5" />
            <span>Orçamentos</span>
          </NavLink>
          
          <NavLink
            to="/technician/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 ${
                isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`
            }
          >
            <Settings className="h-5 w-5" />
            <span>Configurações</span>
          </NavLink>
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex items-center justify-between">
          <ThemeSwitcher />
          <Button variant="destructive" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
