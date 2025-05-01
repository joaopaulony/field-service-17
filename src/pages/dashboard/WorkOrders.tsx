
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { fetchWorkOrders, deleteWorkOrder } from '@/services/workOrderService';
import { fetchTechnicians } from '@/services/technicianService';
import { WorkOrder, Technician } from '@/types/workOrders';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Imported Components
import WorkOrdersTable from '@/components/work-orders/WorkOrdersTable';
import { AdvancedFilters } from '@/components/work-orders/AdvancedFilters';
import DeleteWorkOrderDialog from '@/components/work-orders/DeleteWorkOrderDialog';
import ExportDialog from '@/components/ExportDialog';
import { WorkOrderMapView } from '@/components/work-orders/WorkOrderMapView';

const WorkOrders = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [technicianFilter, setTechnicianFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  
  // Fetch work orders
  const { data: workOrders = [], isLoading: isLoadingWorkOrders } = useQuery({
    queryKey: ['workOrders'],
    queryFn: fetchWorkOrders
  });

  // Fetch technicians for filters
  const { data: technicians = [] } = useQuery({
    queryKey: ['technicians'],
    queryFn: fetchTechnicians
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

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('all');
    setTechnicianFilter('all');
  };
  
  // Filter work orders based on all criteria
  const filteredWorkOrders = workOrders.filter(order => {
    // Apply status filter
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }
    
    // Apply date filter
    if (dateFilter !== 'all') {
      const orderDate = new Date(order.created_at);
      const today = new Date();
      
      // Reset time part for date comparisons
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      if (dateFilter === 'today') {
        if (orderDate < todayStart || orderDate > new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)) {
          return false;
        }
      } else if (dateFilter === 'week') {
        // Get start of week (Sunday)
        const startOfWeek = new Date(todayStart);
        startOfWeek.setDate(today.getDate() - today.getDay());
        
        if (orderDate < startOfWeek) {
          return false;
        }
      } else if (dateFilter === 'month') {
        // Get start of month
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        if (orderDate < startOfMonth) {
          return false;
        }
      }
    }
    
    // Apply technician filter
    if (technicianFilter === 'unassigned') {
      if (order.technician_id) return false;
    } else if (technicianFilter !== 'all') {
      if (order.technician_id !== technicianFilter) return false;
    }
    
    // Apply search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.id.toLowerCase().includes(searchLower) ||
        order.title.toLowerCase().includes(searchLower) ||
        (order.client_name && order.client_name.toLowerCase().includes(searchLower)) ||
        (order.location && order.location.toLowerCase().includes(searchLower)) ||
        (order.description && order.description.toLowerCase().includes(searchLower)) ||
        (order.technician && order.technician.name.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });
  
  // Calculate counts for status badges
  const statusCounts = {
    all: workOrders.length,
    pending: workOrders.filter(o => o.status === 'pending').length,
    in_progress: workOrders.filter(o => o.status === 'in_progress').length,
    completed: workOrders.filter(o => o.status === 'completed').length,
    canceled: workOrders.filter(o => o.status === 'canceled').length,
  };

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
      <AdvancedFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        technicianFilter={technicianFilter}
        onTechnicianFilterChange={setTechnicianFilter}
        onResetFilters={resetFilters}
        technicians={technicians}
      />

      {/* Status Tabs and View Switching */}
      <div className="flex justify-between items-center">
        <Tabs defaultValue="all" value={statusFilter} onValueChange={setStatusFilter} className="w-full">
          <TabsList className="grid grid-cols-5 md:w-fit">
            <TabsTrigger value="all" className="relative">
              Todas
              <span className="ml-1 text-xs">{statusCounts.all}</span>
            </TabsTrigger>
            <TabsTrigger value="pending" className="relative">
              Pendentes
              <span className="ml-1 text-xs">{statusCounts.pending}</span>
            </TabsTrigger>
            <TabsTrigger value="in_progress" className="relative">
              Em Andamento
              <span className="ml-1 text-xs">{statusCounts.in_progress}</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="relative">
              Concluídas
              <span className="ml-1 text-xs">{statusCounts.completed}</span>
            </TabsTrigger>
            <TabsTrigger value="canceled" className="relative">
              Canceladas
              <span className="ml-1 text-xs">{statusCounts.canceled}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="hidden md:flex">
          <Tabs value={viewMode} onValueChange={setViewMode} className="ml-auto">
            <TabsList>
              <TabsTrigger value="table">Tabela</TabsTrigger>
              <TabsTrigger value="map">
                <MapPin className="h-4 w-4 mr-1" />
                Mapa
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Content based on View Mode */}
      {viewMode === 'table' ? (
        <WorkOrdersTable 
          workOrders={filteredWorkOrders}
          isLoading={isLoadingWorkOrders}
          onDeleteWorkOrder={openDeleteDialog}
        />
      ) : (
        <WorkOrderMapView workOrders={filteredWorkOrders} />
      )}
      
      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Exibindo {filteredWorkOrders.length} de {workOrders.length} ordens de serviço
      </div>
      
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
