
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, Package, FileText, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import MobileMenu from '@/components/mobile/MobileMenu';

const MobileLayout: React.FC = () => {
  const { user } = useAuth();
  const technicianName = user?.email?.split('@')[0] || '';

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="mobile-header flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <MobileMenu 
            triggerElement={
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            } 
            technicianName={technicianName}
          />
          <div className="font-semibold">OrderSys</div>
        </div>
        <div>
          {/* Optional: Add any header elements here */}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </main>

      <footer className="border-t bg-background">
        <nav className="grid grid-cols-4 h-14">
          <NavLink
            to="/technician"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 text-xs ${
                isActive ? "text-primary" : "text-muted-foreground"
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
              `flex flex-col items-center justify-center gap-1 text-xs ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`
            }
          >
            <Package className="h-5 w-5" />
            <span>Estoque</span>
          </NavLink>
          
          <NavLink
            to="/technician/quotes"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 text-xs ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`
            }
          >
            <FileText className="h-5 w-5" />
            <span>Orçamentos</span>
          </NavLink>

          <NavLink
            to="/technician/settings"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 text-xs ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`
            }
          >
            <User className="h-5 w-5" />
            <span>Perfil</span>
          </NavLink>
        </nav>
      </footer>
    </div>
  );
};

export default MobileLayout;
