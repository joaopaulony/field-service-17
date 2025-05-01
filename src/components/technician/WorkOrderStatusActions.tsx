
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { startWorkOrder, completeWorkOrder } from '@/services/workOrderService';
import { WorkOrder } from '@/types/workOrders';
import { useGeolocation } from '@/utils/geolocationUtils';
import { AlertTriangle, CheckCircle2, MapPin, Loader } from 'lucide-react';

interface WorkOrderStatusActionsProps {
  workOrder: WorkOrder;
  refetch: () => void;
}

const WorkOrderStatusActions: React.FC<WorkOrderStatusActionsProps> = ({ workOrder, refetch }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { getLocation } = useGeolocation();
  
  const handleStartWorkOrder = async () => {
    setIsLoading(true);
    
    try {
      // Obter localização atual
      const position = await getLocation();
      
      if (!position) {
        toast({
          title: "Erro de localização",
          description: "Não foi possível obter sua localização. Verifique as permissões do navegador.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Iniciar ordem de serviço com a localização
      await startWorkOrder(workOrder.id, position);
      
      toast({
        title: "Ordem de serviço iniciada",
        description: "A ordem de serviço foi iniciada com sucesso.",
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Erro ao iniciar ordem de serviço",
        description: error.message || "Ocorreu um erro ao iniciar a ordem de serviço",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCompleteWorkOrder = async () => {
    setIsLoading(true);
    
    try {
      // Obter localização atual
      const position = await getLocation();
      
      if (!position) {
        toast({
          title: "Erro de localização",
          description: "Não foi possível obter sua localização. Verifique as permissões do navegador.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Concluir ordem de serviço com a localização
      await completeWorkOrder(workOrder.id, position);
      
      toast({
        title: "Ordem de serviço concluída",
        description: "A ordem de serviço foi concluída com sucesso.",
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Erro ao concluir ordem de serviço",
        description: error.message || "Ocorreu um erro ao concluir a ordem de serviço",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-2">
      {workOrder.status === 'pending' && (
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 flex items-center gap-2 justify-center" 
          onClick={handleStartWorkOrder}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              <span>Obtendo localização...</span>
            </>
          ) : (
            <>
              <AlertTriangle className="h-4 w-4" />
              <span>Iniciar Ordem de Serviço</span>
            </>
          )}
        </Button>
      )}
      
      {workOrder.status === 'in_progress' && (
        <Button 
          className="w-full bg-green-600 hover:bg-green-700 flex items-center gap-2 justify-center" 
          onClick={handleCompleteWorkOrder}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              <span>Obtendo localização...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span>Concluir Ordem de Serviço</span>
            </>
          )}
        </Button>
      )}
      
      {workOrder.status === 'completed' && (
        <div className="text-center py-3 bg-muted rounded-md">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <p className="text-sm font-medium">Ordem de serviço concluída</p>
          </div>
          {workOrder.completion_date && (
            <p className="text-xs text-muted-foreground mt-1">
              Concluída em: {new Date(workOrder.completion_date).toLocaleString()}
            </p>
          )}
        </div>
      )}
      
      {workOrder.status === 'canceled' && (
        <div className="text-center py-3 bg-muted rounded-md">
          <p className="text-sm text-red-600 font-medium">Ordem de serviço cancelada</p>
        </div>
      )}

      {(workOrder.start_latitude && workOrder.start_longitude) && (
        <div className="flex items-center justify-center border rounded-md p-2 text-xs text-muted-foreground mt-1">
          <MapPin className="h-3 w-3 mr-1" />
          <span>Local registrado no início do trabalho</span>
        </div>
      )}
    </div>
  );
};

export default WorkOrderStatusActions;
