
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCoordinates } from '@/utils/geolocationUtils';
import { WorkOrder } from '@/types/workOrders';
import { MapPin, Clock, CheckCircle2, AlertTriangle, XCircle, User } from 'lucide-react';

interface WorkOrderMapViewProps {
  workOrders: WorkOrder[];
}

export const WorkOrderMapView: React.FC<WorkOrderMapViewProps> = ({ workOrders }) => {
  const ordersWithLocation = workOrders.filter(
    order => order.start_latitude || order.completion_latitude
  );
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'in_progress':
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'canceled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };
  
  // Placeholder for map implementation - in a real app you would integrate with a maps API
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Mapa de Ordens de Serviço</span>
          <Badge variant="outline">{ordersWithLocation.length} ordens com localização</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {ordersWithLocation.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
            <p className="mt-4 text-muted-foreground">Nenhuma ordem de serviço possui dados de geolocalização.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-md text-center">
              <p>Visualização de mapa será implementada em breve.</p>
              <p className="text-sm text-muted-foreground mt-2">Aqui está uma lista das ordens de serviço com dados de localização:</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {ordersWithLocation.map(order => (
                <Card key={order.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium truncate">{order.title}</h3>
                      {getStatusIcon(order.status)}
                    </div>
                    
                    {order.client_name && (
                      <div className="flex items-center gap-1.5 text-xs mt-2">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span>{order.client_name}</span>
                      </div>
                    )}
                    
                    {(order.start_latitude && order.start_longitude) && (
                      <div className="flex items-center gap-1.5 text-xs mt-2">
                        <MapPin className="h-3 w-3 text-blue-500" />
                        <span>Início: {formatCoordinates(order.start_latitude, order.start_longitude)}</span>
                      </div>
                    )}
                    
                    {(order.completion_latitude && order.completion_longitude) && (
                      <div className="flex items-center gap-1.5 text-xs mt-1">
                        <MapPin className="h-3 w-3 text-green-500" />
                        <span>Fim: {formatCoordinates(order.completion_latitude, order.completion_longitude)}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1.5 text-xs mt-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>{formatDate(order.created_at)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
