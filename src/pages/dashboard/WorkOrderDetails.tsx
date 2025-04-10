
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { fetchWorkOrderById, deleteWorkOrder } from '@/services/workOrderService';
import { WorkOrderDetails as WorkOrderDetailsComponent } from '@/components/work-orders/WorkOrderDetails';
import DeleteWorkOrderDialog from '@/components/work-orders/DeleteWorkOrderDialog';
import { useToast } from '@/hooks/use-toast';

import GeneratePDFButton from '@/components/work-orders/GeneratePDFButton';

const WorkOrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Fetch Work Order
  const { data: workOrder, isLoading, refetch } = useQuery({
    queryKey: ['workOrder', id],
    queryFn: () => fetchWorkOrderById(id!),
  });
  
  // Delete Work Order
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  
  const deleteWorkOrderMutation = useMutation({
    mutationFn: () => deleteWorkOrder(id!),
    onSuccess: () => {
      toast({
        title: "Ordem de serviço excluída",
        description: "A ordem de serviço foi excluída com sucesso.",
      });
      navigate('/dashboard/work-orders');
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir ordem de serviço",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    },
  });
  
  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    setIsDeleting(true);
    deleteWorkOrderMutation.mutate();
  };
  
  if (isLoading || !workOrder) {
    return (
      <div className="flex items-center justify-center h-full">
        <Clock className="mr-2 h-4 w-4 animate-spin" />
        Carregando ordem de serviço...
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/dashboard/work-orders')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{workOrder?.title}</h1>
            <p className="text-muted-foreground">
              Detalhes da ordem de serviço <Badge>{workOrder?.id}</Badge>
            </p>
          </div>
        </div>
        
        {/* Ações para a ordem de serviço */}
        <div className="flex items-center gap-2">
          {workOrder && (
            <GeneratePDFButton 
              workOrder={workOrder} 
              disabled={workOrder.status !== 'completed'} 
            />
          )}
          <Button variant="outline" className="gap-2" onClick={() => navigate(`/dashboard/work-orders/${id}/edit`)}>
            <Edit className="h-4 w-4" />
            Editar
          </Button>
          <Button variant="destructive" size="icon" onClick={handleDeleteClick}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <WorkOrderDetailsComponent workOrder={workOrder} />
      
      <Separator className="my-6" />
      
      <DeleteWorkOrderDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        isPending={isDeleting}
      />
    </div>
  );
};

export default WorkOrderDetails;
