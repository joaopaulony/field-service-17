
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  MapPin, 
  ChevronRight,
  CalendarClock,
  Camera,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { fetchTechnicianWorkOrders } from '@/services/workOrderService';
import { WorkOrder, WorkOrderStatus } from '@/types/workOrders';
import { useAuth } from '@/contexts/AuthContext';

// Técnico mockado para teste (em produção, viria da autenticação)
const MOCK_TECHNICIAN_ID = "3fa85f64-5717-4562-b3fc-2c963f66afa6"; // Substitua por um ID real de um técnico

const TechnicianDashboard = () => {
  const { user } = useAuth();
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
  
  const getStatusIcon = (status: WorkOrderStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'in_progress':
        return <AlertTriangle className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">Alta</Badge>;
      case 'medium':
        return <Badge variant="default">Média</Badge>;
      case 'low':
        return <Badge variant="outline">Baixa</Badge>;
      default:
        return null;
    }
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Não agendada';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
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
      <div className="mt-4 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user ? getInitials(user.email || "Técnico") : "TC"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-lg font-semibold">Olá, Técnico!</h1>
            <p className="text-sm text-muted-foreground">Técnico de Campo</p>
          </div>
        </div>
        
        <Card className="bg-muted">
          <CardContent className="p-3 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Hoje</p>
              <p className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{activeOrders.length} OS em andamento</p>
              <p className="text-xs text-muted-foreground">{completedOrders.length} concluídas</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Busca */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar ordens de serviço..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="active">Ativas</TabsTrigger>
          <TabsTrigger value="completed">Concluídas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          {filteredActiveOrders.length > 0 ? (
            filteredActiveOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <Link to={`/tech/orders/${order.id}`}>
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span className="font-semibold">{order.id.slice(0, 8)}</span>
                        </div>
                      </div>
                      
                      <h3 className="font-medium mb-1">{order.title}</h3>
                      <p className="text-sm text-muted-foreground mb-1">{order.client_name || 'Cliente não informado'}</p>
                      
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{order.location || 'Local não informado'}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <CalendarClock className="h-3.5 w-3.5" />
                        <span>{formatDate(order.scheduled_date)}</span>
                      </div>
                    </div>
                    
                    <div className="bg-secondary/40 p-3 flex justify-between items-center">
                      {order.status === 'pending' ? (
                        <Button size="sm">Iniciar OS</Button>
                      ) : (
                        <Button size="sm">Continuar OS</Button>
                      )}
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Link>
              </Card>
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
              <Card key={order.id} className="overflow-hidden">
                <Link to={`/tech/orders/${order.id}`}>
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span className="font-semibold">{order.id.slice(0, 8)}</span>
                        </div>
                      </div>
                      
                      <h3 className="font-medium mb-1">{order.title}</h3>
                      <p className="text-sm text-muted-foreground mb-1">{order.client_name || 'Cliente não informado'}</p>
                      
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{order.location || 'Local não informado'}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                        <span>Concluído em {formatDate(order.completion_date)}</span>
                      </div>
                    </div>
                    
                    <div className="bg-secondary/40 p-3 flex justify-between items-center">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Camera className="h-3.5 w-3.5" />
                        <span>{order.photos ? order.photos.length : 0} fotos</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Link>
              </Card>
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
      
      {/* Quick Actions */}
      <div className="mt-8 mb-4">
        <h2 className="text-lg font-semibold mb-3">Ações Rápidas</h2>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-20 flex-col" asChild>
            <Link to="/tech/scan">
              <Camera className="h-6 w-6 mb-1" />
              <span>Escanear QR</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-20 flex-col" asChild>
            <Link to="/tech/history">
              <CheckCircle2 className="h-6 w-6 mb-1" />
              <span>Histórico</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TechnicianDashboard;
