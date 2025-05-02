
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Technician, TechnicianPerformance } from '@/types/workOrders';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { fetchTechnicianPerformance } from '@/services/technician';
import { format, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';

interface TechnicianPerformanceDashboardProps {
  technician: Technician;
}

const TechnicianPerformanceDashboard: React.FC<TechnicianPerformanceDashboardProps> = ({ technician }) => {
  // Calculate dates for the last 6 months
  const endDate = new Date();
  const startDate = subMonths(endDate, 6);
  
  const formattedStartDate = format(startDate, 'yyyy-MM-dd');
  const formattedEndDate = format(endDate, 'yyyy-MM-dd');

  const { data: performance, isLoading } = useQuery({
    queryKey: ['technicianPerformance', technician.id, formattedStartDate, formattedEndDate],
    queryFn: () => fetchTechnicianPerformance(technician.id, formattedStartDate, formattedEndDate),
  });

  // Format performance data for charts
  const formatPerformanceForChart = (data: TechnicianPerformance[] = []) => {
    return data.map(p => ({
      period: format(new Date(p.period_start), 'MMM/yy', { locale: ptBR }),
      ordens: p.completed_work_orders,
      tempo: Math.round(p.average_completion_time_minutes / 60), // Convert to hours
      avaliacao: p.customer_satisfaction_rating,
      receita: p.revenue_generated
    })).reverse(); // Most recent first
  };

  const chartData = formatPerformanceForChart(performance);

  if (isLoading) {
    return (
      <Card className="shadow-md mt-6">
        <CardHeader>
          <CardTitle>Desempenho</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!performance || performance.length === 0) {
    return (
      <Card className="shadow-md mt-6">
        <CardHeader>
          <CardTitle>Desempenho</CardTitle>
          <CardDescription>Histórico dos últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-muted-foreground">
            Sem dados de desempenho disponíveis. Os dados serão mostrados quando o técnico completar ordens de serviço.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md mt-6">
      <CardHeader>
        <CardTitle>Desempenho</CardTitle>
        <CardDescription>Histórico dos últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Completed Work Orders Chart */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Ordens de Serviço Concluídas</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="period" angle={0} />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={(value) => [`${value} ordens`, 'Concluídas']} />
                  <Bar dataKey="ordens" fill="#0284c7" name="Ordens Concluídas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Average Completion Time Chart */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Tempo Médio de Conclusão (horas)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="period" angle={0} />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={(value) => [`${value} horas`, 'Tempo Médio']} />
                  <Bar dataKey="tempo" fill="#22c55e" name="Tempo Médio (horas)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 p-4 rounded-md text-center">
              <p className="text-sm text-muted-foreground">Total de Ordens</p>
              <p className="text-2xl font-bold">
                {chartData.reduce((sum, item) => sum + item.ordens, 0)}
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-md text-center">
              <p className="text-sm text-muted-foreground">Tempo Médio</p>
              <p className="text-2xl font-bold">
                {Math.round(chartData.reduce((sum, item, idx) => sum + item.tempo, 0) / chartData.length)} h
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-md text-center">
              <p className="text-sm text-muted-foreground">Receita Gerada</p>
              <p className="text-2xl font-bold">
                R$ {chartData.reduce((sum, item) => sum + item.receita, 0)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicianPerformanceDashboard;
