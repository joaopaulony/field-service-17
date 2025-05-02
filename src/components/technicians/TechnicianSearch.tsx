
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface TechnicianSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const TechnicianSearch: React.FC<TechnicianSearchProps> = ({
  searchTerm,
  onSearchChange
}) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar técnicos..."
        className="pl-9"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default TechnicianSearch;
