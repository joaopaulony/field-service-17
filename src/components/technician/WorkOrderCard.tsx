
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  User, 
  Clock,
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  Wrench
} from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WorkOrder } from '@/types/workOrders';
import { formatCoordinates } from '@/utils/geolocationUtils';

interface WorkOrderCardProps {
  workOrder: WorkOrder;
  showCompletionDetails?: boolean;
}

const WorkOrderCard: React.FC<WorkOrderCardProps> = ({ 
  workOrder,
  showCompletionDetails = false
}) => {
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Não agendado';
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusBadge = () => {
    switch (workOrder.status) {
      case 'pending':
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            <span>Pendente</span>
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 flex items-center gap-1.5">
            <Wrench className="h-3 w-3" />
            <span>Em Andamento</span>
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1.5">
            <CheckCircle className="h-3 w-3" />
            <span>Concluído</span>
          </Badge>
        );
      case 'canceled':
        return (
          <Badge variant="destructive" className="flex items-center gap-1.5">
            <AlertTriangle className="h-3 w-3" />
            <span>Cancelado</span>
          </Badge>
        );
      default:
        return null;
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <div>
              <h3 className="font-semibold text-lg truncate">{workOrder.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{workOrder.description}</p>
            </div>
            <div className="flex sm:flex-col items-start sm:items-end gap-2">
              {getStatusBadge()}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {workOrder.client_name && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{workOrder.client_name}</span>
              </div>
            )}
            
            {workOrder.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm truncate">{workOrder.location}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {workOrder.scheduled_date ? formatDate(workOrder.scheduled_date) : "Não agendado"}
              </span>
            </div>
          </div>
          
          {showCompletionDetails && workOrder.completion_date && (
            <div className="mt-4 pt-3 border-t">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Concluído em: {formatDate(workOrder.completion_date)}</span>
              </div>
              
              {(workOrder.completion_latitude && workOrder.completion_longitude) && (
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-green-500" />
                  <span className="text-xs">
                    Local: {formatCoordinates(workOrder.completion_latitude, workOrder.completion_longitude)}
                  </span>
                </div>
              )}
            </div>
          )}
          
          {!showCompletionDetails && (workOrder.start_latitude || workOrder.start_longitude) && (
            <div className="mt-4 pt-3 border-t">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span className="text-xs">
                  Localização registrada ao iniciar serviço
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="px-4 py-3 bg-muted/30">
        <Button variant="default" size="sm" className="ml-auto" asChild>
          <Link to={`/tech/orders/${workOrder.id}`}>
            <span className="mr-1">Ver Detalhes</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkOrderCard;
