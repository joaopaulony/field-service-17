
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchWorkOrders } from '@/services/workOrderService';
import { fetchTechnicians } from '@/services/technicianService';
import { WorkOrder } from '@/types/workOrders';

// Component imports
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatusCardList from '@/components/dashboard/StatusCardList';
import WeeklyActivityChart, { processWeeklyData } from '@/components/dashboard/WeeklyActivityChart';
import TechnicianPerformanceChart, { processTechnicianPerformance } from '@/components/dashboard/TechnicianPerformanceChart';
import QuickActionGrid from '@/components/dashboard/QuickActionGrid';

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

  // Show loading state when data is being fetched
  if (isLoadingWorkOrders || isLoadingTechnicians) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      {/* Dashboard Header */}
      <DashboardHeader />
      
      {/* Status Cards */}
      <StatusCardList statusCounts={statusCounts} />
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <WeeklyActivityChart weeklyData={weeklyData} />
        <TechnicianPerformanceChart technicianPerformance={technicianPerformance} />
      </div>
      
      {/* Quick Actions */}
      <QuickActionGrid />
    </div>
  );
};

export default Dashboard;
