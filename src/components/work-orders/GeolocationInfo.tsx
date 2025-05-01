
import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WorkOrder } from '@/types/workOrders';
import { formatCoordinates, calculateDistance } from '@/utils/geolocationUtils';

interface GeolocationInfoProps {
  workOrder: WorkOrder;
}

export const GeolocationInfo: React.FC<GeolocationInfoProps> = ({ workOrder }) => {
  const hasStartLocation = workOrder.start_latitude && workOrder.start_longitude;
  const hasCompletionLocation = workOrder.completion_latitude && workOrder.completion_longitude;
  
  const distance = calculateDistance(
    workOrder.start_latitude,
    workOrder.start_longitude,
    workOrder.completion_latitude,
    workOrder.completion_longitude
  );
  
  const openInMaps = (lat?: number | null, lng?: number | null) => {
    if (lat && lng) {
      window.open(`https://maps.google.com/?q=${lat},${lng}`, '_blank');
    }
  };
  
  if (!hasStartLocation && !hasCompletionLocation) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações de Localização</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasStartLocation && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Localização de Início:</span>
              <span className="text-sm">{formatCoordinates(workOrder.start_latitude, workOrder.start_longitude)}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => openInMaps(workOrder.start_latitude, workOrder.start_longitude)}
            >
              <Navigation className="h-3.5 w-3.5" />
              <span>Ver no Mapa</span>
            </Button>
          </div>
        )}
        
        {hasCompletionLocation && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Localização de Conclusão:</span>
              <span className="text-sm">{formatCoordinates(workOrder.completion_latitude, workOrder.completion_longitude)}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => openInMaps(workOrder.completion_latitude, workOrder.completion_longitude)}
            >
              <Navigation className="h-3.5 w-3.5" />
              <span>Ver no Mapa</span>
            </Button>
          </div>
        )}
        
        {distance !== null && (
          <div className="mt-2 border-t pt-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Distância percorrida:</span>
              <span className="text-sm">{distance.toFixed(2)} km</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
