
import { supabase } from "@/integrations/supabase/client";
import { 
  WorkOrder, 
  CreateWorkOrderDTO, 
  UpdateWorkOrderDTO 
} from "@/types/workOrders";
import { canCreateWorkOrder } from "@/services/planService";

export const fetchWorkOrders = async (): Promise<WorkOrder[]> => {
  const { data, error } = await supabase
    .from('work_orders')
    .select(`
      *,
      technician:technicians(*)
    `)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data as unknown as WorkOrder[] || [];
};

export const fetchWorkOrderById = async (id: string): Promise<WorkOrder | null> => {
  const { data, error } = await supabase
    .from('work_orders')
    .select(`
      *,
      technician:technicians(*),
      photos:work_order_photos(*)
    `)
    .eq('id', id)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') return null; // Registro não encontrado
    throw error;
  }
  
  return data as unknown as WorkOrder;
};

export const createWorkOrder = async (workOrder: CreateWorkOrderDTO): Promise<WorkOrder> => {
  // Get the authenticated user's ID to use as company_id
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Usuário não autenticado');
  
  // Check if the company can create more work orders this month
  const canCreate = await canCreateWorkOrder();
  if (!canCreate) {
    throw new Error('Limite de ordens de serviço para o plano atingido');
  }
  
  const { data, error } = await supabase
    .from('work_orders')
    .insert({
      company_id: user.id,
      title: workOrder.title,
      description: workOrder.description,
      client_name: workOrder.client_name,
      location: workOrder.location,
      technician_id: workOrder.technician_id,
      scheduled_date: workOrder.scheduled_date
    })
    .select()
    .single();
    
  if (error) throw error;
  return data as unknown as WorkOrder;
};

export const updateWorkOrder = async (id: string, updates: UpdateWorkOrderDTO): Promise<WorkOrder> => {
  const { data, error } = await supabase
    .from('work_orders')
    .update({
      title: updates.title,
      description: updates.description,
      status: updates.status,
      client_name: updates.client_name,
      location: updates.location,
      technician_id: updates.technician_id,
      scheduled_date: updates.scheduled_date,
      notes: updates.notes,
      completion_date: updates.completion_date,
      signature_url: updates.signature_url,
      start_latitude: updates.start_latitude,
      start_longitude: updates.start_longitude,
      completion_latitude: updates.completion_latitude,
      completion_longitude: updates.completion_longitude
    } as any)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data as unknown as WorkOrder;
};

export const deleteWorkOrder = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('work_orders')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};

// Start a work order with geolocation
export const startWorkOrder = async (id: string, position: GeolocationPosition): Promise<WorkOrder> => {
  const { data, error } = await supabase
    .from('work_orders')
    .update({
      status: 'in_progress',
      start_latitude: position.coords.latitude,
      start_longitude: position.coords.longitude
    } as any)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data as unknown as WorkOrder;
};

// Complete a work order with geolocation
export const completeWorkOrder = async (id: string, position: GeolocationPosition): Promise<WorkOrder> => {
  const { data, error } = await supabase
    .from('work_orders')
    .update({
      status: 'completed',
      completion_date: new Date().toISOString(),
      completion_latitude: position.coords.latitude,
      completion_longitude: position.coords.longitude
    } as any)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data as unknown as WorkOrder;
};

// Buscar ordens de serviço de um técnico específico
export const fetchTechnicianWorkOrders = async (technicianId: string): Promise<WorkOrder[]> => {
  const { data, error } = await supabase
    .from('work_orders')
    .select(`
      *,
      photos:work_order_photos(*)
    `)
    .eq('technician_id', technicianId)
    .order('scheduled_date', { ascending: true });
    
  if (error) throw error;
  return data as unknown as WorkOrder[] || [];
};

// Buscar todas as ordens de serviço com detalhes completos para exportação
export const fetchWorkOrdersForExport = async (): Promise<WorkOrder[]> => {
  const { data, error } = await supabase
    .from('work_orders')
    .select(`
      *,
      technician:technicians(*),
      photos:work_order_photos(*)
    `)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data as unknown as WorkOrder[] || [];
};
