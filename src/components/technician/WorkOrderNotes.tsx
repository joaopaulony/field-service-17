
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateWorkOrder } from '@/services/workOrderService';
import { WorkOrder } from '@/types/workOrders';

interface WorkOrderNotesProps {
  workOrder: WorkOrder;
  refetch: () => void;
}

const WorkOrderNotes: React.FC<WorkOrderNotesProps> = ({ workOrder, refetch }) => {
  const { toast } = useToast();
  const [notes, setNotes] = useState(workOrder.notes || '');

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<WorkOrder>) => updateWorkOrder(workOrder.id, updates),
    onSuccess: () => {
      toast({
        title: "Ordem de Serviço atualizada",
        description: "A OS foi atualizada com sucesso."
      });
      refetch();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar Ordem de Serviço",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const handleSaveNotes = async () => {
    updateMutation.mutate({ notes });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Anotações</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea 
          value={notes} 
          onChange={handleNotesChange} 
          placeholder="Adicione anotações sobre a ordem de serviço..." 
          className="mb-4"
        />
        <Button onClick={handleSaveNotes} disabled={updateMutation.isPending}>
          {updateMutation.isPending ? (
            <>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Anotações
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WorkOrderNotes;
