
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { fetchWorkOrders, deleteWorkOrder } from '@/services/workOrderService';
import { WorkOrder } from '@/types/workOrders';

// Imported Components
import WorkOrdersTable from '@/components/work-orders/WorkOrdersTable';
import WorkOrdersFilters from '@/components/work-orders/WorkOrdersFilters';
import DeleteWorkOrderDialog from '@/components/work-orders/DeleteWorkOrderDialog';
import ExportDialog from '@/components/ExportDialog';

const WorkOrders = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  
  // Fetch work orders
  const { data: workOrders = [], isLoading } = useQuery({
    queryKey: ['workOrders'],
    queryFn: fetchWorkOrders
  });
  
  // Delete work order mutation
  const deleteMutation = useMutation({
    mutationFn: deleteWorkOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      toast({
        title: "Ordem de serviço excluída",
        description: "A ordem de serviço foi excluída com sucesso."
      });
      setIsDeleteOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir ordem de serviço",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Handle export button click
  const handleExport = () => {
    setIsExportOpen(true);
  };
  
  // Open delete confirmation dialog
  const openDeleteDialog = (workOrder: WorkOrder) => {
    setSelectedWorkOrder(workOrder);
    setIsDeleteOpen(true);
  };
  
  // Handle delete work order confirmation
  const handleDeleteWorkOrder = () => {
    if (!selectedWorkOrder) return;
    deleteMutation.mutate(selectedWorkOrder.id);
  };
  
  // Filter work orders by search term and status
  const filteredWorkOrders = workOrders.filter(order => {
    // Apply status filter
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }
    
    // Apply search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.id.toLowerCase().includes(searchLower) ||
        order.title.toLowerCase().includes(searchLower) ||
        (order.client_name && order.client_name.toLowerCase().includes(searchLower)) ||
        (order.location && order.location.toLowerCase().includes(searchLower)) ||
        (order.technician && order.technician.name.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Ordens de Serviço</h1>
          <p className="text-muted-foreground">Gerencie todas as ordens de serviço da sua empresa.</p>
        </div>
        <Button asChild>
          <Link to="/dashboard/work-orders/create">
            <Plus className="mr-2 h-4 w-4" />
            Nova OS
          </Link>
        </Button>
      </div>
      
      {/* Filters */}
      <WorkOrdersFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onExportClick={handleExport}
      />
      
      {/* Table */}
      <WorkOrdersTable 
        workOrders={filteredWorkOrders}
        isLoading={isLoading}
        onDeleteWorkOrder={openDeleteDialog}
      />
      
      {/* Dialogs */}
      <DeleteWorkOrderDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDeleteWorkOrder}
        isPending={deleteMutation.isPending}
      />
      
      <ExportDialog 
        open={isExportOpen} 
        onOpenChange={setIsExportOpen} 
      />
    </div>
  );
};

export default WorkOrders;
