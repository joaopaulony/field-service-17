
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  MapPin, 
  ChevronRight,
  CalendarClock,
  Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

// Mock data
const assignedOrders = [
  {
    id: "OS-002",
    title: "Instalação de câmeras",
    client: "Restaurante XYZ",
    location: "Rio de Janeiro, RJ",
    status: "in_progress",
    priority: "medium",
    scheduledDate: "2023-04-10T14:00:00",
  },
  {
    id: "OS-007",
    title: "Manutenção de elevador",
    client: "Edifício Comercial",
    location: "Porto Alegre, RS",
    status: "in_progress",
    priority: "high",
    scheduledDate: "2023-04-10T09:30:00",
  },
  {
    id: "OS-005",
    title: "Substituição de equipamento",
    client: "Escola Municipal",
    location: "Salvador, BA",
    status: "pending",
    priority: "low",
    scheduledDate: "2023-04-11T11:00:00",
  },
];

const completedOrders = [
  {
    id: "OS-003",
    title: "Reparo em rede elétrica",
    client: "Loja 123",
    location: "Belo Horizonte, MG",
    status: "completed",
    priority: "high",
    completedDate: "2023-04-09T16:45:00",
  },
  {
    id: "OS-004",
    title: "Manutenção preventiva",
    client: "Hospital Central",
    location: "Brasília, DF",
    status: "completed",
    priority: "medium",
    completedDate: "2023-04-08T13:20:00",
  },
];

const getStatusIcon = (status: string) => {
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const TechnicianDashboard = () => {
  return (
    <div className="mobile-container">
      {/* Header */}
      <div className="mt-4 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary text-primary-foreground">JS</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-lg font-semibold">Olá, João Silva!</h1>
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
              <p className="text-sm font-medium">2 OS em andamento</p>
              <p className="text-xs text-muted-foreground">1 agendada para amanhã</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="active">Ativas</TabsTrigger>
          <TabsTrigger value="completed">Concluídas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          {assignedOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <Link to={`/tech/orders/${order.id}`}>
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className="font-semibold">{order.id}</span>
                      </div>
                      {getPriorityBadge(order.priority)}
                    </div>
                    
                    <h3 className="font-medium mb-1">{order.title}</h3>
                    <p className="text-sm text-muted-foreground mb-1">{order.client}</p>
                    
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{order.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <CalendarClock className="h-3.5 w-3.5" />
                      <span>{formatDate(order.scheduledDate)}</span>
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
          ))}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          {completedOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <Link to={`/tech/orders/${order.id}`}>
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className="font-semibold">{order.id}</span>
                      </div>
                      {getPriorityBadge(order.priority)}
                    </div>
                    
                    <h3 className="font-medium mb-1">{order.title}</h3>
                    <p className="text-sm text-muted-foreground mb-1">{order.client}</p>
                    
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{order.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      <span>Concluído em {formatDate(order.completedDate)}</span>
                    </div>
                  </div>
                  
                  <div className="bg-secondary/40 p-3 flex justify-between items-center">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Camera className="h-3.5 w-3.5" />
                      <span>4 fotos</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
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
