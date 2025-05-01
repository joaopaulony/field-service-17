
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  ClipboardCheck, 
  ClipboardX, 
  SendHorizonal, 
  Clock 
} from "lucide-react";
import { QuoteSummary } from '@/types/quotes';

interface QuoteCardProps {
  summary: QuoteSummary;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ summary }) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <SendHorizonal className="mr-2 h-5 w-5" />
          Resumo de Orçamentos
        </CardTitle>
        <CardDescription>Visão geral dos seus orçamentos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="flex flex-col items-center justify-center bg-muted/50 p-3 rounded-lg">
            <span className="text-xs text-muted-foreground mb-1">Total</span>
            <span className="text-2xl font-bold">{summary.total}</span>
          </div>
          
          <div className="flex flex-col items-center justify-center bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
            <div className="flex items-center text-xs text-blue-700 dark:text-blue-400 mb-1">
              <Clock className="h-3.5 w-3.5 mr-1" />
              Pendentes
            </div>
            <span className="text-2xl font-bold text-blue-700 dark:text-blue-400">
              {summary.pending}
            </span>
          </div>
          
          <div className="flex flex-col items-center justify-center bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
            <div className="flex items-center text-xs text-green-700 dark:text-green-400 mb-1">
              <ClipboardCheck className="h-3.5 w-3.5 mr-1" />
              Aprovados
            </div>
            <span className="text-2xl font-bold text-green-700 dark:text-green-400">
              {summary.approved}
            </span>
          </div>
          
          <div className="flex flex-col items-center justify-center bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
            <div className="flex items-center text-xs text-red-700 dark:text-red-400 mb-1">
              <ClipboardX className="h-3.5 w-3.5 mr-1" />
              Rejeitados
            </div>
            <span className="text-2xl font-bold text-red-700 dark:text-red-400">
              {summary.rejected}
            </span>
          </div>
          
          <div className="flex flex-col items-center justify-center bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg">
            <div className="flex items-center text-xs text-amber-700 dark:text-amber-400 mb-1">
              <Clock className="h-3.5 w-3.5 mr-1" />
              Expirados
            </div>
            <span className="text-2xl font-bold text-amber-700 dark:text-amber-400">
              {summary.expired}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex justify-between items-center w-full text-sm text-muted-foreground">
          <div className="flex items-center">
            <BarChart className="h-4 w-4 mr-1" />
            <span>Valor total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.totalValue)}</span>
          </div>
          <div>
            <span>Aprovados: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.approvedValue)}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default QuoteCard;
