
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, ArrowLeft, FileText } from 'lucide-react';
import { fetchWorkOrderById } from '@/services/workOrderService';
import PhotoGrid from '@/components/PhotoGrid';

// Import our components
import WorkOrderDetails from '@/components/technician/WorkOrderDetails';
import WorkOrderNotes from '@/components/technician/WorkOrderNotes';
import PhotoUpload from '@/components/technician/PhotoUpload';
import SignaturePadComponent from '@/components/technician/SignaturePadComponent';
import GeneratePDFButton from '@/components/work-orders/GeneratePDFButton';
import WorkOrderStatusActions from '@/components/technician/WorkOrderStatusActions';

const WorkOrderView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Fetch Work Order
  const { data: workOrder, isLoading, refetch } = useQuery({
    queryKey: ['workOrder', id],
    queryFn: () => fetchWorkOrderById(id!),
  });
  
  const handleGoBack = () => {
    navigate('/tech');
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
      <div className="mb-6 flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={handleGoBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{workOrder.title}</h1>
          <p className="text-muted-foreground">
            Detalhes da ordem de serviço <Badge>{workOrder.id}</Badge>
          </p>
        </div>
        
        {/* Botão para gerar PDF (apenas para ordens concluídas) */}
        {workOrder.status === 'completed' && (
          <GeneratePDFButton workOrder={workOrder} />
        )}
      </div>
      
      {/* Status actions - Novo componente */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Ações</CardTitle>
        </CardHeader>
        <CardContent>
          <WorkOrderStatusActions workOrder={workOrder} refetch={refetch} />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Detalhes da Ordem de Serviço */}
        <WorkOrderDetails workOrder={workOrder} />
        
        {/* Anotações */}
        <WorkOrderNotes workOrder={workOrder} refetch={refetch} />
      </div>
      
      <Separator className="my-6" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Adicionar Fotos */}
        <PhotoUpload workOrderId={id!} refetch={refetch} />
        
        {/* Assinatura */}
        <SignaturePadComponent workOrderId={id!} refetch={refetch} />
      </div>
      
      {/* Galeria de Fotos */}
      {workOrder.photos && workOrder.photos.length > 0 && (
        <>
          <Separator className="my-6" />
          <Card>
            <CardHeader>
              <CardTitle>Fotos da Ordem de Serviço</CardTitle>
            </CardHeader>
            <CardContent>
              <PhotoGrid photos={workOrder.photos} refetch={refetch} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default WorkOrderView;
