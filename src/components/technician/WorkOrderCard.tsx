
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  ChevronRight,
  CalendarClock,
  Camera
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WorkOrder, WorkOrderStatus } from '@/types/workOrders';

interface WorkOrderCardProps {
  workOrder: WorkOrder;
  showCompletionDetails?: boolean;
}

const WorkOrderCard: React.FC<WorkOrderCardProps> = ({ workOrder, showCompletionDetails = false }) => {
  const getStatusIcon = (status: WorkOrderStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'in_progress':
        return <AlertTriangle className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Não agendada';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  return (
    <Card className="overflow-hidden">
      <Link to={`/tech/orders/${workOrder.id}`}>
        <CardContent className="p-0">
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(workOrder.status)}
                <span className="font-semibold">{workOrder.id.slice(0, 8)}</span>
              </div>
            </div>
            
            <h3 className="font-medium mb-1">{workOrder.title}</h3>
            <p className="text-sm text-muted-foreground mb-1">{workOrder.client_name || 'Cliente não informado'}</p>
            
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
              <MapPin className="h-3.5 w-3.5" />
              <span>{workOrder.location || 'Local não informado'}</span>
            </div>
            
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              {showCompletionDetails ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                  <span>Concluído em {formatDate(workOrder.completion_date)}</span>
                </>
              ) : (
                <>
                  <CalendarClock className="h-3.5 w-3.5" />
                  <span>{formatDate(workOrder.scheduled_date)}</span>
                </>
              )}
            </div>
          </div>
          
          <div className="bg-secondary/40 p-3 flex justify-between items-center">
            {!showCompletionDetails ? (
              workOrder.status === 'pending' ? (
                <Button size="sm">Iniciar OS</Button>
              ) : (
                <Button size="sm">Continuar OS</Button>
              )
            ) : (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Camera className="h-3.5 w-3.5" />
                <span>{workOrder.photos ? workOrder.photos.length : 0} fotos</span>
              </div>
            )}
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default WorkOrderCard;
