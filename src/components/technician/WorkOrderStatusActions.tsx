
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { startWorkOrder, completeWorkOrder } from '@/services/workOrderService';
import { WorkOrder } from '@/types/workOrders';

interface WorkOrderStatusActionsProps {
  workOrder: WorkOrder;
  refetch: () => void;
}

const WorkOrderStatusActions: React.FC<WorkOrderStatusActionsProps> = ({ workOrder, refetch }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalização não suportada pelo navegador'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    });
  };
  
  const handleStartWorkOrder = async () => {
    setIsLoading(true);
    
    try {
      // Obter localização atual
      const position = await getCurrentPosition();
      
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
        description: error.message || "Não foi possível obter sua localização",
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
      const position = await getCurrentPosition();
      
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
        description: error.message || "Não foi possível obter sua localização",
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
          className="w-full" 
          onClick={handleStartWorkOrder}
          disabled={isLoading}
        >
          {isLoading ? "Obtendo localização..." : "Iniciar Ordem de Serviço"}
        </Button>
      )}
      
      {workOrder.status === 'in_progress' && (
        <Button 
          className="w-full" 
          onClick={handleCompleteWorkOrder}
          disabled={isLoading}
        >
          {isLoading ? "Obtendo localização..." : "Concluir Ordem de Serviço"}
        </Button>
      )}
      
      {workOrder.status === 'completed' && (
        <div className="text-center py-2 bg-muted rounded-md">
          <p className="text-sm text-muted-foreground">Ordem de serviço concluída</p>
        </div>
      )}
    </div>
  );
};

export default WorkOrderStatusActions;
