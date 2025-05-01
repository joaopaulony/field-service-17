
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  Calendar,
  Download,
  FileText,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { fetchWorkOrdersForExport } from '@/services/workOrderService';
import { fetchTechnicians } from '@/services/technicianService';
import { WorkOrder } from '@/types/workOrders';
import { Link } from 'react-router-dom';

// Import charts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Reports = () => {
  const [dateRange, setDateRange] = useState('month');
  const [reportType, setReportType] = useState('orders');

  // Fetch work orders
  const { data: workOrders = [], isLoading: isLoadingWorkOrders } = useQuery({
    queryKey: ['workOrdersExport'],
    queryFn: fetchWorkOrdersForExport
  });

  // Fetch technicians
  const { data: technicians = [], isLoading: isLoadingTechnicians } = useQuery({
    queryKey: ['technicians'],
    queryFn: fetchTechnicians
  });

  // Filter work orders by date range
  const filterByDateRange = (orders: WorkOrder[]) => {
    const now = new Date();
    const startDate = new Date();
    
    switch (dateRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1); // Default to month
    }
    
    return orders.filter(order => new Date(order.created_at) >= startDate);
  };

  // Prepare data for status chart
  const getStatusChartData = () => {
    const filteredOrders = filterByDateRange(workOrders);
    const statusCounts = {
      pending: 0,
      in_progress: 0,
      completed: 0,
      canceled: 0
    };
    
    filteredOrders.forEach(order => {
      statusCounts[order.status] += 1;
    });
    
    return [
      { name: 'Pendente', value: statusCounts.pending, color: '#f59e0b' },
      { name: 'Em Andamento', value: statusCounts.in_progress, color: '#3b82f6' },
      { name: 'Concluído', value: statusCounts.completed, color: '#10b981' },
      { name: 'Cancelado', value: statusCounts.canceled, color: '#ef4444' }
    ];
  };
  
  // Prepare data for technician performance chart
  const getTechnicianPerformanceData = () => {
    const filteredOrders = filterByDateRange(workOrders);
    const techPerformance = new Map();
    
    technicians.forEach(tech => {
      techPerformance.set(tech.id, {
        name: tech.name,
        completed: 0,
        inProgress: 0,
        pending: 0
      });
    });
    
    filteredOrders.forEach(order => {
      if (order.technician_id && techPerformance.has(order.technician_id)) {
        const techData = techPerformance.get(order.technician_id);
        
        switch (order.status) {
          case 'completed':
            techData.completed += 1;
            break;
          case 'in_progress':
            techData.inProgress += 1;
            break;
          case 'pending':
            techData.pending += 1;
            break;
        }
      }
    });
    
    return Array.from(techPerformance.values())
      .filter(tech => tech.completed > 0 || tech.inProgress > 0 || tech.pending > 0)
      .sort((a, b) => (b.completed + b.inProgress + b.pending) - (a.completed + a.inProgress + a.pending));
  };

  const statusChartData = getStatusChartData();
  const technicianPerformanceData = getTechnicianPerformanceData();

  // Handle export button click
  const handleExport = () => {
    // This would be implemented with a proper export function
    alert('Funcionalidade de exportação será implementada em breve!');
  };

  const isLoading = isLoadingWorkOrders || isLoadingTechnicians;

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Relatórios</h1>
            <p className="text-muted-foreground">Visualize estatísticas e insights sobre sua operação.</p>
          </div>
        </div>
        
        <Button onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Exportar Dados
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Período:</span>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Última Semana</SelectItem>
              <SelectItem value="month">Último Mês</SelectItem>
              <SelectItem value="quarter">Último Trimestre</SelectItem>
              <SelectItem value="year">Último Ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Tipo:</span>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="orders">Ordens de Serviço</SelectItem>
              <SelectItem value="technicians">Desempenho de Técnicos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="charts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="charts">Gráficos</TabsTrigger>
          <TabsTrigger value="summary">Resumo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts" className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {reportType === 'orders' ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Distribuição de Status</CardTitle>
                    <CardDescription>
                      Visão geral das ordens de serviço por status
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {statusChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Desempenho por Técnico</CardTitle>
                    <CardDescription>
                      Ordens de serviço atribuídas a cada técnico por status
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={technicianPerformanceData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="completed" stackId="a" name="Concluídas" fill="#10b981" />
                        <Bar dataKey="inProgress" stackId="a" name="Em Andamento" fill="#3b82f6" />
                        <Bar dataKey="pending" stackId="a" name="Pendentes" fill="#f59e0b" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Resumo dos Dados</CardTitle>
              <CardDescription>
                Estatísticas e métricas principais
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Métricas Gerais
                    </h3>
                    <Separator className="mb-4" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-muted rounded-md p-4">
                        <p className="text-sm text-muted-foreground">Total de Ordens</p>
                        <p className="text-2xl font-bold">{filterByDateRange(workOrders).length}</p>
                      </div>
                      <div className="bg-muted rounded-md p-4">
                        <p className="text-sm text-muted-foreground">Concluídas</p>
                        <p className="text-2xl font-bold">{statusChartData.find(s => s.name === 'Concluído')?.value || 0}</p>
                      </div>
                      <div className="bg-muted rounded-md p-4">
                        <p className="text-sm text-muted-foreground">Técnicos Ativos</p>
                        <p className="text-2xl font-bold">{technicians.filter(t => t.active).length}</p>
                      </div>
                      <div className="bg-muted rounded-md p-4">
                        <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
                        <p className="text-2xl font-bold">
                          {filterByDateRange(workOrders).length > 0 
                            ? `${Math.round((statusChartData.find(s => s.name === 'Concluído')?.value || 0) / filterByDateRange(workOrders).length * 100)}%` 
                            : '0%'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
