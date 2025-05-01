
import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Clipboard, Home, LogOut, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const MobileLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <Link to="/tech" className="flex items-center gap-2">
            <div className="bg-primary rounded-md p-1">
              <Clipboard size={20} className="text-white" />
            </div>
            <span className="font-semibold text-lg">FieldService</span>
          </Link>
          
          <Button variant="ghost" size="icon" asChild>
            <Link to="/tech/profile">
              <User size={20} />
            </Link>
          </Button>
        </div>
      </header>
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <footer className="border-t border-border">
        <div className="grid grid-cols-3 divide-x divide-border">
          <Link 
            to="/tech" 
            className={`flex flex-col items-center justify-center py-3 px-2 ${
              isActive('/tech') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Home size={20} />
            <span className="text-xs mt-1">Início</span>
          </Link>
          
          <Link 
            to="/tech/settings" 
            className={`flex flex-col items-center justify-center py-3 px-2 ${
              isActive('/tech/settings') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Settings size={20} />
            <span className="text-xs mt-1">Ajustes</span>
          </Link>
          
          <button 
            onClick={handleSignOut}
            className="flex flex-col items-center justify-center py-3 px-2 text-muted-foreground w-full"
          >
            <LogOut size={20} />
            <span className="text-xs mt-1">Sair</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default MobileLayout;
