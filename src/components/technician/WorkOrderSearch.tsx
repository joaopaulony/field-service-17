
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface WorkOrderSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const WorkOrderSearch: React.FC<WorkOrderSearchProps> = ({
  searchTerm,
  onSearchChange
}) => {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar ordens de serviço..."
        className="pl-9"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default WorkOrderSearch;
