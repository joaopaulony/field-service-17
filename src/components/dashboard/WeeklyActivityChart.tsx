
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WorkOrder } from '@/types/workOrders';

type WeeklyActivityChartProps = {
  weeklyData: any[];
};

export const processWeeklyData = (orders: WorkOrder[]) => {
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

const WeeklyActivityChart = ({ weeklyData }: WeeklyActivityChartProps) => {
  return (
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
  );
};

export default WeeklyActivityChart;
