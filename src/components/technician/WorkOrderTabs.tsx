
import React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { WorkOrder } from '@/types/workOrders';
import WorkOrderCard from './WorkOrderCard';

interface WorkOrderTabsProps {
  activeOrders: WorkOrder[];
  completedOrders: WorkOrder[];
}

const WorkOrderTabs: React.FC<WorkOrderTabsProps> = ({ activeOrders, completedOrders }) => {
  return (
    <Tabs defaultValue="active" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="active">Ativas</TabsTrigger>
        <TabsTrigger value="completed">Concluídas</TabsTrigger>
      </TabsList>
      
      <TabsContent value="active" className="space-y-4">
        {activeOrders.length > 0 ? (
          activeOrders.map((order) => (
            <WorkOrderCard key={order.id} workOrder={order} />
          ))
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">
              Nenhuma ordem de serviço ativa encontrada.
            </p>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="completed" className="space-y-4">
        {completedOrders.length > 0 ? (
          completedOrders.map((order) => (
            <WorkOrderCard 
              key={order.id} 
              workOrder={order} 
              showCompletionDetails={true} 
            />
          ))
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">
              Nenhuma ordem de serviço concluída encontrada.
            </p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default WorkOrderTabs;
