
import React from 'react';
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

// Mock data
const statusData = [
  { status: 'Pendente', value: 8, icon: <Clock className="h-5 w-5 text-amber-500" /> },
  { status: 'Em Andamento', value: 12, icon: <AlertTriangle className="h-5 w-5 text-blue-500" /> },
  { status: 'Concluído', value: 24, icon: <CheckCircle2 className="h-5 w-5 text-green-500" /> },
  { status: 'Cancelado', value: 3, icon: <XCircle className="h-5 w-5 text-red-500" /> },
];

const weeklyData = [
  { name: 'Seg', pendentes: 4, andamento: 2, concluidas: 5 },
  { name: 'Ter', pendentes: 3, andamento: 4, concluidas: 3 },
  { name: 'Qua', pendentes: 5, andamento: 3, concluidas: 6 },
  { name: 'Qui', pendentes: 6, andamento: 2, concluidas: 4 },
  { name: 'Sex', pendentes: 4, andamento: 5, concluidas: 7 },
  { name: 'Sáb', pendentes: 2, andamento: 3, concluidas: 5 },
  { name: 'Dom', pendentes: 1, andamento: 1, concluidas: 2 },
];

const technicianPerformance = [
  { name: 'João Silva', completed: 12 },
  { name: 'Maria Oliveira', completed: 9 },
  { name: 'Carlos Santos', completed: 15 },
  { name: 'Ana Souza', completed: 8 },
  { name: 'Roberto Lima', completed: 11 },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo de volta! Aqui está um resumo das suas atividades.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" asChild>
            <Link to="/dashboard/work-orders">Ver Ordens de Serviço</Link>
          </Button>
          <Button asChild>
            <Link to="/dashboard/work-orders/create">Nova Ordem de Serviço</Link>
          </Button>
        </div>
      </div>
      
      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusData.map((item) => (
          <Card key={item.status}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{item.status}</p>
                  <h3 className="text-2xl font-bold mt-1">{item.value}</h3>
                </div>
                <div className="bg-muted p-3 rounded-full">
                  {item.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
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
        
        <Card className="col-span-1">
          <CardHeader>
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
        <Card>
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
        
        <Card>
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
        
        <Card>
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
