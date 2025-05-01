
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Package, AlertTriangle, Ban } from "lucide-react";
import { InventorySummary } from '@/types/inventory';

interface InventoryCardProps {
  summary: InventorySummary;
}

const InventoryCard: React.FC<InventoryCardProps> = ({ summary }) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Package className="mr-2 h-5 w-5" />
          Resumo do Estoque
        </CardTitle>
        <CardDescription>Visão geral dos itens em estoque</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center justify-center bg-muted/50 p-3 rounded-lg">
            <span className="text-xs text-muted-foreground mb-1">Total de Itens</span>
            <span className="text-2xl font-bold">{summary.totalItems}</span>
          </div>
          
          <div className="flex flex-col items-center justify-center bg-muted/50 p-3 rounded-lg">
            <span className="text-xs text-muted-foreground mb-1">Valor do Estoque</span>
            <span className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.totalValue)}
            </span>
          </div>
          
          <div className="flex flex-col items-center justify-center bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg">
            <div className="flex items-center text-xs text-amber-700 dark:text-amber-400 mb-1">
              <AlertTriangle className="h-3.5 w-3.5 mr-1" />
              Estoque Baixo
            </div>
            <span className="text-2xl font-bold text-amber-700 dark:text-amber-400">
              {summary.lowStockItems}
            </span>
          </div>
          
          <div className="flex flex-col items-center justify-center bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
            <div className="flex items-center text-xs text-red-700 dark:text-red-400 mb-1">
              <Ban className="h-3.5 w-3.5 mr-1" />
              Descontinuados
            </div>
            <span className="text-2xl font-bold text-red-700 dark:text-red-400">
              {summary.discontinuedItems}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex justify-between items-center w-full text-sm text-muted-foreground">
          <div className="flex items-center">
            <BarChart className="h-4 w-4 mr-1" />
            <span>Monitorando {summary.activeItems} itens ativos</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default InventoryCard;
