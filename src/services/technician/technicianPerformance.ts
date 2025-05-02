
import { supabase } from "@/integrations/supabase/client";
import { TechnicianPerformance } from "@/types/workOrders";

// Fetch performance data for a technician
export const fetchTechnicianPerformance = async (
  technicianId: string, 
  startDate?: string, 
  endDate?: string
): Promise<TechnicianPerformance[]> => {
  let query = supabase
    .from('technician_performance')
    .select('*')
    .eq('technician_id', technicianId);
  
  if (startDate) {
    query = query.gte('period_start', startDate);
  }
  
  if (endDate) {
    query = query.lte('period_end', endDate);
  }
  
  const { data, error } = await query.order('period_start', { ascending: false });
    
  if (error) throw error;
  return data as TechnicianPerformance[] || [];
};

// Calculate and store a technician's performance for a period
export const calculateTechnicianPerformance = async (
  technicianId: string,
  periodStart: string,
  periodEnd: string
): Promise<TechnicianPerformance> => {
  // Get all completed work orders for the technician in the period
  const { data: workOrders, error: workOrderError } = await supabase
    .from('work_orders')
    .select('*')
    .eq('technician_id', technicianId)
    .eq('status', 'completed')
    .gte('completion_date', periodStart)
    .lte('completion_date', periodEnd);
  
  if (workOrderError) throw workOrderError;
  
  // Calculate metrics
  const completedWorkOrders = workOrders.length;
  
  let totalCompletionMinutes = 0;
  let revenue = 0;
  
  workOrders.forEach(workOrder => {
    const createdDate = new Date(workOrder.created_at);
    const completionDate = new Date(workOrder.completion_date);
    const minutes = Math.round((completionDate.getTime() - createdDate.getTime()) / (1000 * 60));
    
    totalCompletionMinutes += minutes;
    // Here we could add logic to calculate revenue if we had financial data
  });
  
  const averageCompletionTimeMinutes = completedWorkOrders > 0 
    ? Math.round(totalCompletionMinutes / completedWorkOrders) 
    : 0;
  
  // Store the calculated metrics
  const { data, error } = await supabase
    .from('technician_performance')
    .insert({
      technician_id: technicianId,
      period_start: periodStart,
      period_end: periodEnd,
      completed_work_orders: completedWorkOrders,
      average_completion_time_minutes: averageCompletionTimeMinutes,
      customer_satisfaction_rating: 0, // We would need a rating system for this
      revenue_generated: revenue
    })
    .select()
    .single();
    
  if (error) throw error;
  return data as TechnicianPerformance;
};
