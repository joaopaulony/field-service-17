
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Technician, WorkOrder } from '@/types/workOrders';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';

interface TechnicianWorkHistoryProps {
  technician: Technician;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 dark:bg-yellow-900/30 dark:text-yellow-500",
  in_progress: "bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-900/30 dark:text-blue-500",
  completed: "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900/30 dark:text-green-500",
  canceled: "bg-red-100 text-red-800 hover:bg-red-100/80 dark:bg-red-900/30 dark:text-red-500"
};

const statusLabels = {
  pending: "Pendente",
  in_progress: "Em Progresso",
  completed: "Concluído",
  canceled: "Cancelado"
};

const TechnicianWorkHistory: React.FC<TechnicianWorkHistoryProps> = ({ technician }) => {
  const fetchWorkOrders = async () => {
    const { data, error } = await supabase
      .from('work_orders')
      .select('*')
      .eq('technician_id', technician.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }
    
    return data as WorkOrder[];
  };

  const { data: workOrders, isLoading } = useQuery({
    queryKey: ['technicianWorkOrders', technician.id],
    queryFn: fetchWorkOrders,
  });

  if (isLoading) {
    return (
      <Card className="shadow-md mt-6">
        <CardHeader>
          <CardTitle>Histórico de Trabalho</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!workOrders || workOrders.length === 0) {
    return (
      <Card className="shadow-md mt-6">
        <CardHeader>
          <CardTitle>Histórico de Trabalho</CardTitle>
          <CardDescription>Últimas ordens de serviço</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-muted-foreground">
            Nenhuma ordem de serviço encontrada para este técnico.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md mt-6">
      <CardHeader>
        <CardTitle>Histórico de Trabalho</CardTitle>
        <CardDescription>Últimas ordens de serviço</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {workOrders.map((order) => (
            <div key={order.id} className="border rounded-md p-3 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{order.title}</h3>
                <Badge className={statusColors[order.status]}>
                  {statusLabels[order.status]}
                </Badge>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {order.description && <p className="line-clamp-1">{order.description}</p>}
                <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2">
                  {order.client_name && (
                    <div>
                      <span className="font-medium">Cliente:</span> {order.client_name}
                    </div>
                  )}
                  {order.scheduled_date && (
                    <div>
                      <span className="font-medium">Agendado:</span> {format(parseISO(order.scheduled_date), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </div>
                  )}
                  {order.completion_date && (
                    <div>
                      <span className="font-medium">Concluído:</span> {format(parseISO(order.completion_date), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicianWorkHistory;
