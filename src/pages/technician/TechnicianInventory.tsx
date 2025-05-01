
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getInventoryItems } from '@/services/inventoryService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Package, Search, AlertTriangle } from 'lucide-react';

const TechnicianInventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: inventoryItems = [], isLoading } = useQuery({
    queryKey: ['inventoryItems'],
    queryFn: getInventoryItems,
  });
  
  const filteredItems = inventoryItems.filter(item => 
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
    <div className="mobile-container space-y-4">
      <h1 className="text-2xl font-bold mb-4">Estoque</h1>
      
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, SKU ou categoria..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            Nenhum item encontrado.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg flex justify-between items-start">
                  <div className="flex items-center">
                    <Package className="h-5 w-5 mr-2 text-primary" />
                    <span>{item.name}</span>
                  </div>
                  {getStatusBadge(item.status)}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">SKU:</p>
                    <p>{item.sku || "—"}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground">Categoria:</p>
                    <p>{item.category?.name || "Sem categoria"}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground">Preço:</p>
                    <p>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unit_price)}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground">Em estoque:</p>
                    <p className={`flex items-center ${item.quantity <= item.min_quantity ? "text-amber-600 font-medium" : ""}`}>
                      {item.quantity <= item.min_quantity && <AlertTriangle className="h-4 w-4 mr-1 text-amber-600" />}
                      {item.quantity}
                    </p>
                  </div>
                </div>
                
                {item.description && (
                  <div className="mt-3">
                    <p className="text-muted-foreground text-sm">Descrição:</p>
                    <p className="text-sm">{item.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TechnicianInventory;
