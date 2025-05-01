
import React, { useState } from 'react';
import { Bell, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WorkOrderSearch from './WorkOrderSearch';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Link } from 'react-router-dom';

interface TechnicianHeaderProps {
  technicianName: string;
}

const TechnicianHeader: React.FC<TechnicianHeaderProps> = ({ technicianName }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
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
          <ThemeSwitcher variant="ghost" />
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
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
