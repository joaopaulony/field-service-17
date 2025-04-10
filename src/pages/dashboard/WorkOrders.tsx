
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Plus, 
  Search, 
  Filter, 
  Download,
  MoreHorizontal,
  FileText,
  Trash2,
  Edit,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Mock data
const workOrders = [
  {
    id: "OS-001",
    title: "Manutenção de ar-condicionado",
    client: "Empresa ABC",
    location: "São Paulo, SP",
    technician: "João Silva",
    status: "pending",
    priority: "high",
    createdAt: "2023-04-05T10:30:00",
  },
  {
    id: "OS-002",
    title: "Instalação de câmeras",
    client: "Restaurante XYZ",
    location: "Rio de Janeiro, RJ",
    technician: "Maria Oliveira",
    status: "in_progress",
    priority: "medium",
    createdAt: "2023-04-06T09:15:00",
  },
  {
    id: "OS-003",
    title: "Reparo em rede elétrica",
    client: "Loja 123",
    location: "Belo Horizonte, MG",
    technician: "Carlos Santos",
    status: "completed",
    priority: "high",
    createdAt: "2023-04-04T14:20:00",
  },
  {
    id: "OS-004",
    title: "Manutenção preventiva",
    client: "Hospital Central",
    location: "Brasília, DF",
    technician: "Ana Souza",
    status: "completed",
    priority: "medium",
    createdAt: "2023-04-03T11:45:00",
  },
  {
    id: "OS-005",
    title: "Substituição de equipamento",
    client: "Escola Municipal",
    location: "Salvador, BA",
    technician: "Roberto Lima",
    status: "pending",
    priority: "low",
    createdAt: "2023-04-07T08:00:00",
  },
  {
    id: "OS-006",
    title: "Instalação de rede WiFi",
    client: "Escritório Advogados",
    location: "Curitiba, PR",
    technician: "João Silva",
    status: "cancelled",
    priority: "medium",
    createdAt: "2023-04-02T13:30:00",
  },
  {
    id: "OS-007",
    title: "Manutenção de elevador",
    client: "Edifício Comercial",
    location: "Porto Alegre, RS",
    technician: "Maria Oliveira",
    status: "in_progress",
    priority: "high",
    createdAt: "2023-04-06T15:10:00",
  },
];

const WorkOrders = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-xs font-medium text-amber-500">Pendente</span>
          </div>
        );
      case 'in_progress':
        return (
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-blue-500" />
            <span className="text-xs font-medium text-blue-500">Em Andamento</span>
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
            <span className="text-xs font-medium text-green-500">Concluído</span>
          </div>
        );
      case 'cancelled':
        return (
          <div className="flex items-center gap-1.5">
            <XCircle className="h-3.5 w-3.5 text-red-500" />
            <span className="text-xs font-medium text-red-500">Cancelado</span>
          </div>
        );
      default:
        return null;
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">Alta</span>;
      case 'medium':
        return <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">Média</span>;
      case 'low':
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">Baixa</span>;
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
    }).format(date);
  };
  
  const handleExport = () => {
    toast({
      title: "Exportação iniciada",
      description: "O arquivo será baixado em instantes.",
    });
  };
  
  const filteredWorkOrders = workOrders.filter(order => {
    // Apply status filter
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }
    
    // Apply search term filter (case insensitive)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.id.toLowerCase().includes(searchLower) ||
        order.title.toLowerCase().includes(searchLower) ||
        order.client.toLowerCase().includes(searchLower) ||
        order.location.toLowerCase().includes(searchLower) ||
        order.technician.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  return (
    <div className="space-y-6">
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
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar ordens de serviço..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select defaultValue="all" onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="in_progress">Em Andamento</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>
      
      {/* Table */}
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Título</TableHead>
              <TableHead className="hidden md:table-cell">Cliente</TableHead>
              <TableHead className="hidden md:table-cell">Local</TableHead>
              <TableHead className="hidden lg:table-cell">Técnico</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Prioridade</TableHead>
              <TableHead className="hidden md:table-cell">Data</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWorkOrders.length > 0 ? (
              filteredWorkOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.title}</TableCell>
                  <TableCell className="hidden md:table-cell">{order.client}</TableCell>
                  <TableCell className="hidden md:table-cell">{order.location}</TableCell>
                  <TableCell className="hidden lg:table-cell">{order.technician}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="hidden lg:table-cell">{getPriorityBadge(order.priority)}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(order.createdAt)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/dashboard/work-orders/${order.id}`} className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Ver Detalhes</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/dashboard/work-orders/${order.id}/edit`} className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/dashboard/work-orders/${order.id}/report`} className="cursor-pointer">
                            <FileText className="mr-2 h-4 w-4" />
                            <span>Relatório</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 cursor-pointer">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Excluir</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                  Nenhuma ordem de serviço encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default WorkOrders;
