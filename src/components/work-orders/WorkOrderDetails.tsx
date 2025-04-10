
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, User, MapPin, Clock, CheckCircle } from 'lucide-react';
import { WorkOrder } from '@/types/workOrders';

interface WorkOrderDetailsProps {
  workOrder: WorkOrder;
}

export const WorkOrderDetails: React.FC<WorkOrderDetailsProps> = ({ workOrder }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalhes da Ordem de Serviço</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Descrição:</span>
          <p className="text-sm">{workOrder.description || 'Nenhuma descrição fornecida.'}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Cliente:</span>
          <p className="text-sm">{workOrder.client_name || 'Não especificado'}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Localização:</span>
          <p className="text-sm">{workOrder.location || 'Não especificado'}</p>
        </div>
        
        {workOrder.scheduled_date && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Agendado para:</span>
            <p className="text-sm">{new Date(workOrder.scheduled_date).toLocaleString()}</p>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Status:</span>
          <Badge variant="secondary">{workOrder.status}</Badge>
        </div>
      </CardContent>
    </Card>
  );
};
