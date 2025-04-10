
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTechnicianWorkOrders } from '@/services/workOrderService';
import { WorkOrder, WorkOrderStatus } from '@/types/workOrders';

// Import refactored components
import TechnicianHeader from '@/components/technician/TechnicianHeader';
import WorkOrderSearch from '@/components/technician/WorkOrderSearch';
import WorkOrderTabs from '@/components/technician/WorkOrderTabs';
import QuickActions from '@/components/technician/QuickActions';

// Técnico mockado para teste (em produção, viria da autenticação)
const MOCK_TECHNICIAN_ID = "3fa85f64-5717-4562-b3fc-2c963f66afa6"; // Substitua por um ID real de um técnico

const TechnicianDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Consulta para buscar ordens de serviço do técnico
  const { data: workOrders = [], isLoading } = useQuery({
    queryKey: ['technicianWorkOrders', MOCK_TECHNICIAN_ID],
    queryFn: () => fetchTechnicianWorkOrders(MOCK_TECHNICIAN_ID)
  });
  
  // Filtrar ordens de serviço ativas e concluídas
  const activeOrders = workOrders.filter(order => 
    order.status === 'pending' || order.status === 'in_progress'
  );
  
  const completedOrders = workOrders.filter(order => 
    order.status === 'completed'
  );
  
  // Filtrar por termo de busca
  const filteredActiveOrders = activeOrders.filter(order => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    
    return (
      order.id.toLowerCase().includes(searchLower) ||
      order.title.toLowerCase().includes(searchLower) ||
      (order.client_name && order.client_name.toLowerCase().includes(searchLower)) ||
      (order.location && order.location.toLowerCase().includes(searchLower))
    );
  });
  
  const filteredCompletedOrders = completedOrders.filter(order => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    
    return (
      order.id.toLowerCase().includes(searchLower) ||
      order.title.toLowerCase().includes(searchLower) ||
      (order.client_name && order.client_name.toLowerCase().includes(searchLower)) ||
      (order.location && order.location.toLowerCase().includes(searchLower))
    );
  });
  
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando ordens de serviço...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mobile-container">
      {/* Header */}
      <TechnicianHeader 
        activeOrders={activeOrders.length} 
        completedOrders={completedOrders.length} 
      />
      
      {/* Search */}
      <WorkOrderSearch 
        searchTerm={searchTerm} 
        onSearchChange={handleSearchChange} 
      />
      
      {/* Work Order Tabs */}
      <WorkOrderTabs 
        activeOrders={filteredActiveOrders} 
        completedOrders={filteredCompletedOrders} 
      />
      
      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
};

export default TechnicianDashboard;
