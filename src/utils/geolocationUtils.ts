
import { useToast } from "@/hooks/use-toast";

// Get current position with better error handling
export const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalização não suportada pelo seu navegador'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      position => resolve(position),
      error => {
        let errorMessage = 'Erro desconhecido ao obter localização';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permissão para geolocalização foi negada';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Informação de localização não disponível';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tempo esgotado ao solicitar localização';
            break;
        }
        
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
};

// Format coordinates to display format
export const formatCoordinates = (lat?: number | null, lng?: number | null): string => {
  if (lat === undefined || lat === null || lng === undefined || lng === null) {
    return 'Não disponível';
  }
  
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};

// Calculate distance between two points in kilometers
export const calculateDistance = (
  lat1?: number | null, 
  lng1?: number | null,
  lat2?: number | null,
  lng2?: number | null
): number | null => {
  if (
    lat1 === undefined || lat1 === null || 
    lng1 === undefined || lng1 === null ||
    lat2 === undefined || lat2 === null ||
    lng2 === undefined || lng2 === null
  ) {
    return null;
  }
  
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
};

// React hook for using geolocation
export const useGeolocation = () => {
  const { toast } = useToast();
  
  const getLocation = async (): Promise<GeolocationPosition | null> => {
    try {
      return await getCurrentPosition();
    } catch (error: any) {
      toast({
        title: "Erro de Geolocalização",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
  };
  
  return { getLocation };
};
