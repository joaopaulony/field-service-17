
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { WorkOrder } from '@/types/workOrders';

interface GeolocationInfoProps {
  workOrder: WorkOrder;
}

export const GeolocationInfo: React.FC<GeolocationInfoProps> = ({ workOrder }) => {
  const hasStartLocation = workOrder.start_latitude && workOrder.start_longitude;
  const hasCompletionLocation = workOrder.completion_latitude && workOrder.completion_longitude;
  
  const formatCoordinates = (lat?: number | null, lng?: number | null) => {
    if (!lat || !lng) return 'Não registrado';
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };
  
  const getGoogleMapsLink = (lat?: number | null, lng?: number | null) => {
    if (!lat || !lng) return '#';
    return `https://www.google.com/maps?q=${lat},${lng}`;
  };
  
  if (!hasStartLocation && !hasCompletionLocation) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Informações de Localização</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasStartLocation && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Local de Início:</span>
              <p className="text-sm">{formatCoordinates(workOrder.start_latitude, workOrder.start_longitude)}</p>
            </div>
            <a 
              href={getGoogleMapsLink(workOrder.start_latitude, workOrder.start_longitude)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline"
            >
              Ver no Google Maps
            </a>
          </div>
        )}
        
        {hasCompletionLocation && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Local de Conclusão:</span>
              <p className="text-sm">{formatCoordinates(workOrder.completion_latitude, workOrder.completion_longitude)}</p>
            </div>
            <a 
              href={getGoogleMapsLink(workOrder.completion_latitude, workOrder.completion_longitude)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline"
            >
              Ver no Google Maps
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
