
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle2,
  MoreHorizontal,
  FileText,
  Trash2,
  Edit,
  Eye,
  XCircle
} from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { WorkOrder, WorkOrderStatus } from '@/types/workOrders';

interface WorkOrdersTableProps {
  workOrders: WorkOrder[];
  isLoading: boolean;
  onDeleteWorkOrder: (workOrder: WorkOrder) => void;
}

const WorkOrdersTable: React.FC<WorkOrdersTableProps> = ({ 
  workOrders, 
  isLoading,
  onDeleteWorkOrder
}) => {
  
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
      case 'canceled':
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
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  return (
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
          ) : workOrders.length > 0 ? (
            workOrders.map((order) => (
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
                        onClick={() => onDeleteWorkOrder(order)}
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
  );
};

export default WorkOrdersTable;
