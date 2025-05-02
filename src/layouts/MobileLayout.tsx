import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, Package, FileText, User } from 'lucide-react';

const MobileLayout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="border-b bg-background sticky top-0 z-10">
        {/* You can add a header content here if needed */}
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
