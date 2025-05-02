
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTechnicianWorkOrders } from '@/services/workOrderService';
import { getCurrentTechnician } from '@/services/technician/technicianAuth';
import { WorkOrder } from '@/types/workOrders';

// Import refactored components
import TechnicianHeader from '@/components/technician/TechnicianHeader';
import WorkOrderSearch from '@/components/technician/WorkOrderSearch';
import WorkOrderTabs from '@/components/technician/WorkOrderTabs';
import QuickActions from '@/components/technician/QuickActions';
import { useToast } from '@/hooks/use-toast';

const TechnicianDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [technicianId, setTechnicianId] = useState<string | null>(null);
  const [technicianName, setTechnicianName] = useState('Técnico');
  const { toast } = useToast();
  
  // Load the current technician information
  useEffect(() => {
    const loadTechnician = async () => {
      try {
        const technician = await getCurrentTechnician();
        if (technician) {
          setTechnicianId(technician.id);
          setTechnicianName(technician.name);
        } else {
          toast({
            title: "Perfil não encontrado",
            description: "Não foi possível encontrar seu perfil de técnico.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching technician data:", error);
        toast({
          title: "Erro ao carregar perfil",
          description: "Ocorreu um erro ao carregar seu perfil de técnico.",
          variant: "destructive",
        });
      }
    };
    
    loadTechnician();
  }, [toast]);
  
  // Consulta para buscar ordens de serviço do técnico
  const { data: workOrders = [], isLoading } = useQuery({
    queryKey: ['technicianWorkOrders', technicianId],
    queryFn: () => technicianId ? fetchTechnicianWorkOrders(technicianId) : Promise.resolve([]),
    enabled: !!technicianId // Only run query when technician ID is available
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
      <TechnicianHeader technicianName={technicianName} />
      
      {/* Search - Campo único de busca */}
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
