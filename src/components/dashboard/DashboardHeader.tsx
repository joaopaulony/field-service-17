
import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CompanyDisplay } from './CompanyDisplay';
import { MobileSidebar } from './MobileSidebar';
import { useAuth } from '@/contexts/AuthContext';

export const DashboardHeader: React.FC = () => {
  const { signOut } = useAuth();

  const handleLogout = () => {
    signOut();
  };

  return (
    <header className="h-14 flex items-center gap-4 border-b bg-background px-4 lg:px-6">
      {/* Mobile menu */}
      <MobileSidebar />
      
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
  );
};
