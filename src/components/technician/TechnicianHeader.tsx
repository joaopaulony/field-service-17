
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WorkOrderSearch from './WorkOrderSearch';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

interface TechnicianHeaderProps {
  technicianName: string;
}

const TechnicianHeader: React.FC<TechnicianHeaderProps> = ({ technicianName }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Olá, {technicianName.split(' ')[0]}</h1>
          <p className="text-muted-foreground text-sm">Que bom ter você por aqui</p>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeSwitcher variant="ghost" />
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <WorkOrderSearch />
    </div>
  );
};

export default TechnicianHeader;
