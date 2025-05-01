
import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Clipboard, 
  Users, 
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { fetchWorkOrders } from '@/services/workOrderService';
import { fetchTechnicians } from '@/services/technicianService';
import { WorkOrder, WorkOrderStatus } from '@/types/workOrders';
import { Technician } from '@/types/workOrders';

const Dashboard = () => {
  const [statusCounts, setStatusCounts] = useState({
    pending: 0,
    in_progress: 0,
    completed: 0,
    canceled: 0
  });
  
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [technicianPerformance, setTechnicianPerformance] = useState<any[]>([]);

  // Fetch work orders
  const { data: workOrders = [], isLoading: isLoadingWorkOrders } = useQuery({
    queryKey: ['workOrders'],
    queryFn: fetchWorkOrders
  });

  // Fetch technicians
  const { data: technicians = [], isLoading: isLoadingTechnicians } = useQuery({
    queryKey: ['technicians'],
    queryFn: fetchTechnicians
  });

  // Process data when work orders and technicians are loaded
  useEffect(() => {
    if (!isLoadingWorkOrders && workOrders.length > 0) {
      // Calculate status counts
      const counts = {
        pending: 0,
        in_progress: 0,
        completed: 0,
        canceled: 0
      };
      
      workOrders.forEach((order: WorkOrder) => {
        counts[order.status] += 1;
      });
      
      setStatusCounts(counts);
      
      // Generate weekly data
      const weeklyStats = processWeeklyData(workOrders);
      setWeeklyData(weeklyStats);
      
      // Process technician performance
      if (!isLoadingTechnicians && technicians.length > 0) {
        const techPerformance = processTechnicianPerformance(workOrders, technicians);
        setTechnicianPerformance(techPerformance);
      }
    }
  }, [workOrders, technicians, isLoadingWorkOrders, isLoadingTechnicians]);

  // Process weekly data function
  const processWeeklyData = (orders: WorkOrder[]) => {
    // Get last 7 days
    const days = [];
    const dayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      days.push({
        date,
        name: dayNames[date.getDay() === 0 ? 6 : date.getDay() - 1],
        pendentes: 0,
        andamento: 0,
        concluidas: 0
      });
    }
    
    // Populate data
    orders.forEach((order) => {
      const orderDate = new Date(order.created_at);
      
      // Check if order was created in the last 7 days
      days.forEach((day) => {
        if (orderDate.toDateString() === day.date.toDateString()) {
          switch (order.status) {
            case 'pending':
              day.pendentes += 1;
              break;
            case 'in_progress':
              day.andamento += 1;
              break;
            case 'completed':
              day.concluidas += 1;
              break;
          }
        }
      });
    });
    
    return days;
  };

  // Process technician performance
  const processTechnicianPerformance = (orders: WorkOrder[], techs: Technician[]) => {
    const techMap = new Map<string, number>();
    
    // Initialize with all technicians
    techs.forEach((tech) => {
      techMap.set(tech.id, 0);
    });
    
    // Count completed orders by technician
    orders.forEach((order) => {
      if (order.status === 'completed' && order.technician_id) {
        techMap.set(order.technician_id, (techMap.get(order.technician_id) || 0) + 1);
      }
    });
    
    // Format data for chart
    return techs.map((tech) => ({
      name: tech.name,
      completed: techMap.get(tech.id) || 0
    })).sort((a, b) => b.completed - a.completed).slice(0, 5);
  };

  // Status card data
  const statusData = [
    { 
      status: 'Pendente', 
      value: statusCounts.pending, 
      icon: <Clock className="h-5 w-5 text-amber-500" />,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    { 
      status: 'Em Andamento', 
      value: statusCounts.in_progress, 
      icon: <AlertTriangle className="h-5 w-5 text-blue-500" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    { 
      status: 'Concluído', 
      value: statusCounts.completed, 
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    { 
      status: 'Cancelado', 
      value: statusCounts.canceled, 
      icon: <XCircle className="h-5 w-5 text-red-500" />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo de volta! Aqui está um resumo das suas atividades.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" asChild>
            <Link to="/dashboard/work-orders">Ver Ordens de Serviço</Link>
          </Button>
          <Button asChild>
            <Link to="/dashboard/work-orders/new">Nova Ordem de Serviço</Link>
          </Button>
        </div>
      </div>
      
      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {statusData.map((item) => (
          <Card key={item.status} className={`shadow-sm border ${item.borderColor}`}>
            <CardContent className={`p-6 ${item.bgColor} bg-opacity-30 rounded-lg`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{item.status}</p>
                  <h3 className="text-2xl font-bold mt-1">{item.value}</h3>
                </div>
                <div className={`${item.bgColor} p-3 rounded-full`}>
                  {item.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="col-span-1 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>Atividade Semanal</CardTitle>
            <CardDescription>Ordens de serviço por status nos últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={weeklyData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="concluidas" 
                  stackId="1" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.6} 
                  name="Concluídas"
                />
                <Area 
                  type="monotone" 
                  dataKey="andamento" 
                  stackId="1" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.6}
                  name="Em Andamento"
                />
                <Area 
                  type="monotone" 
                  dataKey="pendentes" 
                  stackId="1" 
                  stroke="#f59e0b" 
                  fill="#f59e0b" 
                  fillOpacity={0.6}
                  name="Pendentes"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>Desempenho por Técnico</CardTitle>
            <CardDescription>Ordens concluídas por técnico no último mês</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={technicianPerformance}
                margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" />
                <Tooltip />
                <Bar dataKey="completed" fill="#0284c7" radius={[0, 4, 4, 0]} name="Concluídas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clipboard className="h-5 w-5" />
              Ordens de Serviço
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Gerencie todas as suas ordens de serviço em um só lugar.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/dashboard/work-orders">Ver Todas</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="shadow-sm bg-gradient-to-br from-purple-50 to-white border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Técnicos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Adicione e gerencie os técnicos da sua equipe de campo.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/dashboard/technicians">Ver Técnicos</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="shadow-sm bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Relatórios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Acesse relatórios e estatísticas detalhadas sobre sua operação.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/dashboard/reports">Ver Relatórios</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
