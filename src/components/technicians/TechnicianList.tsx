
import React from 'react';
import { Mail, Phone, MoreHorizontal, Edit, X, Check, Trash2 } from 'lucide-react';
import { Technician } from '@/types/workOrders';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TechnicianListProps {
  technicians: Technician[];
  isLoading: boolean;
  onEdit: (technician: Technician) => void;
  onDelete: (technician: Technician) => void;
  onToggleStatus: (technician: Technician) => void;
}

const TechnicianList: React.FC<TechnicianListProps> = ({
  technicians,
  isLoading,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={5} className="text-center py-10">
          Carregando técnicos...
        </TableCell>
      </TableRow>
    );
  }

  if (technicians.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
          Nenhum técnico encontrado.
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {technicians.map((technician) => (
        <TableRow key={technician.id}>
          <TableCell className="font-medium">{technician.name}</TableCell>
          <TableCell className="hidden md:table-cell">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              {technician.email}
            </div>
          </TableCell>
          <TableCell className="hidden md:table-cell">
            {technician.phone ? (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {technician.phone}
              </div>
            ) : (
              <span className="text-muted-foreground">Não informado</span>
            )}
          </TableCell>
          <TableCell>
            {technician.active ? (
              <Badge variant="default" className="bg-green-500">Ativo</Badge>
            ) : (
              <Badge variant="outline" className="text-red-500">Inativo</Badge>
            )}
          </TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(technician)}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Editar</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleStatus(technician)}>
                  {technician.active ? (
                    <>
                      <X className="mr-2 h-4 w-4" />
                      <span>Desativar</span>
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      <span>Ativar</span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600" 
                  onClick={() => onDelete(technician)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Excluir</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default TechnicianList;
