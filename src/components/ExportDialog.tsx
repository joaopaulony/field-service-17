
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, FileSpreadsheet, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';

import { fetchTechnicians } from '@/services/technicianService';
import { fetchWorkOrders } from '@/services/workOrderService';
import { exportWorkOrders, ExportFormat, ExportDetailLevel } from '@/services/exportService';
import { WorkOrder, WorkOrderStatus } from '@/types/workOrders';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ExportFormValues = {
  format: ExportFormat;
  detailLevel: ExportDetailLevel;
  status: string;
  technicianId: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
};

const ExportDialog: React.FC<ExportDialogProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const form = useForm<ExportFormValues>({
    defaultValues: {
      format: 'xlsx',
      detailLevel: 'summary',
      status: 'all',
      technicianId: 'all',
      startDate: undefined,
      endDate: undefined,
    },
  });
  
  // Buscar técnicos
  const { data: technicians = [] } = useQuery({
    queryKey: ['technicians'],
    queryFn: fetchTechnicians,
    enabled: open, // Só busca quando o diálogo estiver aberto
  });
  
  // Buscar todas as ordens de serviço para exportação
  const { data: workOrders = [] } = useQuery({
    queryKey: ['workOrders', 'export'],
    queryFn: fetchWorkOrders,
    enabled: open, // Só busca quando o diálogo estiver aberto
  });
  
  const handleExport = async (values: ExportFormValues) => {
    try {
      // Filtra as ordens de serviço com base nos critérios
      let filteredOrders = [...workOrders];
      
      // Filtro por status
      if (values.status !== 'all') {
        filteredOrders = filteredOrders.filter(
          order => order.status === values.status
        );
      }
      
      // Filtro por técnico
      if (values.technicianId !== 'all') {
        filteredOrders = filteredOrders.filter(
          order => order.technician_id === values.technicianId
        );
      }
      
      // Filtro por data inicial
      if (values.startDate) {
        const startDate = new Date(values.startDate);
        startDate.setHours(0, 0, 0, 0);
        filteredOrders = filteredOrders.filter(order => {
          const orderDate = new Date(order.created_at);
          return orderDate >= startDate;
        });
      }
      
      // Filtro por data final
      if (values.endDate) {
        const endDate = new Date(values.endDate);
        endDate.setHours(23, 59, 59, 999);
        filteredOrders = filteredOrders.filter(order => {
          const orderDate = new Date(order.created_at);
          return orderDate <= endDate;
        });
      }
      
      // Se não houver ordens de serviço após filtragem, mostra mensagem
      if (filteredOrders.length === 0) {
        toast({
          title: "Nenhum dado para exportar",
          description: "Não foram encontradas ordens de serviço com os filtros selecionados.",
          variant: "destructive"
        });
        return;
      }
      
      // Prepara o nome do arquivo com base nos filtros
      const dateStr = new Date().toISOString().split('T')[0];
      const fileName = `ordens-servico-${dateStr}`;
      
      // Exporta as ordens de serviço
      exportWorkOrders(filteredOrders, {
        format: values.format,
        detailLevel: values.detailLevel,
        fileName
      });
      
      toast({
        title: "Exportação concluída",
        description: `${filteredOrders.length} ordens de serviço exportadas com sucesso.`
      });
      
      // Fecha o diálogo
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast({
        title: "Erro na exportação",
        description: "Ocorreu um erro ao exportar os dados. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Exportar Ordens de Serviço</DialogTitle>
          <DialogDescription>
            Selecione o formato e os filtros para exportação dos dados.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleExport)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {/* Formato de exportação */}
              <FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Formato</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o formato" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="xlsx">
                          <div className="flex items-center gap-2">
                            <FileSpreadsheet className="h-4 w-4" />
                            <span>Excel (.xlsx)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="csv">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span>CSV (.csv)</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              {/* Nível de detalhe */}
              <FormField
                control={form.control}
                name="detailLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nível de Detalhe</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o nível" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="summary">Resumido</SelectItem>
                        <SelectItem value="detailed">Detalhado</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Filtro por Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">Todos os status</SelectItem>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="in_progress">Em Andamento</SelectItem>
                        <SelectItem value="completed">Concluído</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              {/* Filtro por Técnico */}
              <FormField
                control={form.control}
                name="technicianId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Técnico</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o técnico" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">Todos os técnicos</SelectItem>
                        {technicians.map((tech) => (
                          <SelectItem key={tech.id} value={tech.id}>
                            {tech.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Data Inicial */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data Inicial</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione a data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              
              {/* Data Final */}
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data Final</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione a data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Exportar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
