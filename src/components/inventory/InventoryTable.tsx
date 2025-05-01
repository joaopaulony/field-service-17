
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InventoryItemWithCategory } from '@/types/inventory';
import { Edit, MoreHorizontal, Plus, Trash2, MoveDown, MoveUp, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface InventoryTableProps {
  items: InventoryItemWithCategory[];
  onEdit: (item: InventoryItemWithCategory) => void;
  onDelete: (item: InventoryItemWithCategory) => void;
  onAdjustStock: (item: InventoryItemWithCategory, type: 'in' | 'out') => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ 
  items, 
  onEdit, 
  onDelete,
  onAdjustStock
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.category?.name && item.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-600">Ativo</Badge>;
      case 'discontinued':
        return <Badge variant="destructive">Descontinuado</Badge>;
      case 'low_stock':
        return <Badge variant="outline" className="text-amber-600 border-amber-600">Estoque Baixo</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <div className="flex items-center justify-between p-4">
        <Input
          placeholder="Buscar por nome, SKU ou categoria..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button 
          size="sm" 
          onClick={() => navigate('/dashboard/inventory/new')}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Novo Item
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Preço de Venda</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Nenhum item encontrado
              </TableCell>
            </TableRow>
          ) : (
            filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                    {item.name}
                  </div>
                </TableCell>
                <TableCell>{item.sku || "—"}</TableCell>
                <TableCell>{item.category?.name || "Sem categoria"}</TableCell>
                <TableCell>
                  <span className={item.quantity <= item.min_quantity ? "text-amber-600 font-semibold" : ""}>
                    {item.quantity}
                  </span>
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unit_price)}
                </TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(item)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Editar</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAdjustStock(item, 'in')}>
                        <MoveDown className="mr-2 h-4 w-4" />
                        <span>Adicionar Estoque</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAdjustStock(item, 'out')}>
                        <MoveUp className="mr-2 h-4 w-4" />
                        <span>Remover Estoque</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete(item)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Excluir</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventoryTable;
