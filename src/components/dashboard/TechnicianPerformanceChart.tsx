
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WorkOrder, Technician } from '@/types/workOrders';

type TechnicianPerformanceChartProps = {
  technicianPerformance: any[];
};

export const processTechnicianPerformance = (orders: WorkOrder[], techs: Technician[]) => {
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

const TechnicianPerformanceChart = ({ technicianPerformance }: TechnicianPerformanceChartProps) => {
  return (
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
  );
};

export default TechnicianPerformanceChart;
