
import React from 'react';
import { Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface TechnicianHeaderProps {
  technicianName: string;
}

const TechnicianHeader: React.FC<TechnicianHeaderProps> = ({ technicianName }) => {
  const { signOut, user } = useAuth();
  
  const handleLogout = () => {
    signOut();
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
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Olá, {technicianName.split(' ')[0]}</h1>
          <p className="text-muted-foreground text-sm">Que bom ter você por aqui</p>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeSwitcher variant="ghost" />
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none group">
              <div className="flex items-center gap-2 p-1 px-2 rounded-full profile-gradient border border-blue-200/50 dark:border-blue-800/50 hover:shadow-md transition-all duration-200">
                <Avatar className="h-8 w-8 border-2 border-white/30">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                    {getInitials(technicianName || user?.email || '')}
                  </AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2">
              <div className="flex flex-col p-3 profile-gradient rounded-md mb-2">
                <span className="font-medium">{technicianName}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/technician/settings" className="flex items-center gap-2 py-2">
                  Configurações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer" onClick={handleLogout}>
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default TechnicianHeader;
