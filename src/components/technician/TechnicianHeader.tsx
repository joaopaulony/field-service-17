
import React, { useState } from 'react';
import { Bell, Package, FileText, Settings, User, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WorkOrderSearch from './WorkOrderSearch';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

interface TechnicianHeaderProps {
  technicianName: string;
}

const TechnicianHeader: React.FC<TechnicianHeaderProps> = ({ technicianName }) => {
  const [searchTerm, setSearchTerm] = useState('');
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
  
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Olá, {technicianName.split(' ')[0]}</h1>
          <p className="text-muted-foreground text-sm">Que bom ter você por aqui</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Link to="/technician/inventory">
            <Button variant="outline" size="icon" className="relative">
              <Package className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/technician/quotes">
            <Button variant="outline" size="icon" className="relative">
              <FileText className="h-5 w-5" />
            </Button>
          </Link>
          <ThemeSwitcher variant="ghost" />
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none group">
              <div className="flex items-center gap-2 p-1 px-2 rounded-full bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/40 dark:to-blue-900/40 border border-cyan-200/50 dark:border-cyan-800/50 hover:shadow-md transition-all duration-200">
                <Avatar className="h-8 w-8 border-2 border-white/30">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
                    {getInitials(technicianName || user?.email || '')}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown size={14} className="opacity-70 group-data-[state=open]:rotate-180 transition-transform" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2">
              <div className="flex flex-col p-3 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-md mb-2">
                <span className="font-medium">{technicianName}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/technician/settings" className="flex items-center gap-2 py-2">
                  <Settings size={16} />
                  Configurações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer" onClick={handleLogout}>
                <LogOut size={16} className="mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <WorkOrderSearch 
        searchTerm={searchTerm} 
        onSearchChange={handleSearchChange} 
      />
    </div>
  );
};

export default TechnicianHeader;
