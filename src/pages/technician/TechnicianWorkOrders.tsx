
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clipboard, Filter, Search } from 'lucide-react';
import { fetchTechnicianWorkOrders } from '@/services/workOrderService';
import { getCurrentTechnician } from '@/services/technician/technicianAuth';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import WorkOrderCard from '@/components/technician/WorkOrderCard';
import { WorkOrder } from '@/types/workOrders';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const TechnicianWorkOrders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [technician, setTechnician] = useState<{id: string, name: string} | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadTechnician = async () => {
      try {
        const technicianData = await getCurrentTechnician();
        if (technicianData) {
          setTechnician({
            id: technicianData.id,
            name: technicianData.name
          });
        }
      } catch (error) {
        console.error('Error loading technician data:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar seus dados de técnico.',
          variant: 'destructive'
        });
      }
    };
    
    loadTechnician();
  }, [toast]);
  
  const { data: workOrders = [], isLoading } = useQuery({
    queryKey: ['technicianWorkOrders', technician?.id],
    queryFn: () => technician?.id ? fetchTechnicianWorkOrders(technician.id) : Promise.resolve([]),
    enabled: !!technician?.id
  });
  
  // Filtrar ordens de serviço ativas e concluídas
  const activeOrders = workOrders.filter(order => 
    order.status === 'pending' || order.status === 'in_progress'
  );
  
  const completedOrders = workOrders.filter(order => 
    order.status === 'completed'
  );
  
  // Filtrar por termo de busca
  const filterOrders = (orders: WorkOrder[]) => {
    if (!searchTerm) return orders;
    
    const searchLower = searchTerm.toLowerCase();
    return orders.filter(order => {
      return (
        order.id.toLowerCase().includes(searchLower) ||
        order.title.toLowerCase().includes(searchLower) ||
        (order.client_name && order.client_name.toLowerCase().includes(searchLower)) ||
        (order.location && order.location.toLowerCase().includes(searchLower))
      );
    });
  };
  
  // Ordenar ordens de serviço
  const sortOrders = (orders: WorkOrder[]) => {
    switch(sortBy) {
      case 'date':
        return [...orders].sort((a, b) => {
          const dateA = a.scheduled_date ? new Date(a.scheduled_date).getTime() : 0;
          const dateB = b.scheduled_date ? new Date(b.scheduled_date).getTime() : 0;
          return dateA - dateB;
        });
      case 'client':
        return [...orders].sort((a, b) => {
          const clientA = a.client_name || '';
          const clientB = b.client_name || '';
          return clientA.localeCompare(clientB);
        });
      case 'status':
        return [...orders].sort((a, b) => a.status.localeCompare(b.status));
      default:
        return orders;
    }
  };
  
  const filteredActiveOrders = sortOrders(filterOrders(activeOrders));
  const filteredCompletedOrders = sortOrders(filterOrders(completedOrders));
  
  if (!technician && !isLoading) {
    return (
      <div className="mobile-container py-6">
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <Clipboard className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Sem Acesso</h2>
          <p className="text-muted-foreground">
            Você não possui um perfil de técnico associado à sua conta.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mobile-container py-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Ordens de Serviço</h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filtros</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Em breve: mais opções de filtros</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Campo de busca */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar ordens de serviço..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">
          {isLoading ? 'Carregando...' : `${workOrders.length} ordens encontradas`}
        </p>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:inline">Ordenar por:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="date">Data</SelectItem>
                <SelectItem value="client">Cliente</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="border rounded-lg p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="active">
              Ativas <span className="ml-1.5 bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full">{filteredActiveOrders.length}</span>
            </TabsTrigger>
            <TabsTrigger value="completed">
              Concluídas <span className="ml-1.5 bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full">{filteredCompletedOrders.length}</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4">
            {filteredActiveOrders.length > 0 ? (
              filteredActiveOrders.map((order) => (
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
            {filteredCompletedOrders.length > 0 ? (
              filteredCompletedOrders.map((order) => (
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
      )}
    </div>
  );
};

export default TechnicianWorkOrders;
