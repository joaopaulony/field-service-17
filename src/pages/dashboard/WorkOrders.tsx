
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { fetchWorkOrders, deleteWorkOrder } from '@/services/workOrderService';
import { WorkOrder, WorkOrderStatus } from '@/types/workOrders';

const WorkOrders = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  
  // Consulta para buscar ordens de serviço
  const { data: workOrders = [], isLoading } = useQuery({
    queryKey: ['workOrders'],
    queryFn: fetchWorkOrders
  });
  
  // Mutação para excluir ordem de serviço
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
  
  const getStatusBadge = (status: WorkOrderStatus) => {
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
  
  const openDeleteDialog = (workOrder: WorkOrder) => {
    setSelectedWorkOrder(workOrder);
    setIsDeleteOpen(true);
  };
  
  const handleDeleteWorkOrder = () => {
    if (!selectedWorkOrder) return;
    deleteMutation.mutate(selectedWorkOrder.id);
  };
  
  // Filtrar ordens de serviço por termo de busca e status
  const filteredWorkOrders = workOrders.filter(order => {
    // Aplicar filtro de status
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }
    
    // Aplicar termo de busca (case insensitive)
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
      
      {/* Filtros */}
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
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>
      
      {/* Tabela */}
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
              <TableHead className="hidden md:table-cell">Data</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                    <p className="text-muted-foreground">Carregando ordens de serviço...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredWorkOrders.length > 0 ? (
              filteredWorkOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id.slice(0, 8)}</TableCell>
                  <TableCell>{order.title}</TableCell>
                  <TableCell className="hidden md:table-cell">{order.client_name || '-'}</TableCell>
                  <TableCell className="hidden md:table-cell">{order.location || '-'}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {order.technician ? order.technician.name : '-'}
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(order.created_at)}</TableCell>
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
                        <DropdownMenuItem 
                          className="text-red-600 cursor-pointer"
                          onClick={() => openDeleteDialog(order)}
                        >
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
                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                  Nenhuma ordem de serviço encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* AlertDialog para confirmar exclusão */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Ordem de Serviço</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta ordem de serviço? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteWorkOrder}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WorkOrders;
