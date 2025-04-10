
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import PlanInfoBadge from '@/components/PlanInfoBadge';

interface WorkOrderSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const WorkOrderSearch: React.FC<WorkOrderSearchProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar ordens de serviço..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <PlanInfoBadge className="ml-2" showLabel={false} />
      </div>
    </div>
  );
};

export default WorkOrderSearch;
