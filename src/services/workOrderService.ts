
import { supabase, uploadWorkOrderFile } from "@/integrations/supabase/client";
import { 
  WorkOrder, 
  CreateWorkOrderDTO, 
  UpdateWorkOrderDTO, 
  Technician, 
  CreateTechnicianDTO, 
  WorkOrderPhoto 
} from "@/types/workOrders";

// Serviços para técnicos
export const fetchTechnicians = async (): Promise<Technician[]> => {
  const { data, error } = await supabase
    .from('technicians')
    .select('*')
    .order('name');
    
  if (error) throw error;
  return data || [];
};

export const createTechnician = async (technician: CreateTechnicianDTO): Promise<Technician> => {
  const { data, error } = await supabase
    .from('technicians')
    .insert(technician)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const updateTechnician = async (id: string, updates: Partial<Technician>): Promise<Technician> => {
  const { data, error } = await supabase
    .from('technicians')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const deleteTechnician = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('technicians')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};

// Serviços para ordens de serviço
export const fetchWorkOrders = async (): Promise<WorkOrder[]> => {
  const { data, error } = await supabase
    .from('work_orders')
    .select(`
      *,
      technician:technicians(*)
    `)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data || [];
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
  
  return data;
};

export const createWorkOrder = async (workOrder: CreateWorkOrderDTO): Promise<WorkOrder> => {
  const { data, error } = await supabase
    .from('work_orders')
    .insert(workOrder)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const updateWorkOrder = async (id: string, updates: UpdateWorkOrderDTO): Promise<WorkOrder> => {
  const { data, error } = await supabase
    .from('work_orders')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const deleteWorkOrder = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('work_orders')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};

// Serviços para fotos de ordens de serviço
export const addWorkOrderPhoto = async (
  workOrderId: string, 
  file: File, 
  description?: string
): Promise<WorkOrderPhoto> => {
  // Fazer upload do arquivo
  const photoUrl = await uploadWorkOrderFile(file, `photos/${workOrderId}`);
  
  if (!photoUrl) {
    throw new Error('Falha ao fazer upload da foto');
  }
  
  // Salvar referência no banco de dados
  const { data, error } = await supabase
    .from('work_order_photos')
    .insert({
      work_order_id: workOrderId,
      photo_url: photoUrl,
      description
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const deleteWorkOrderPhoto = async (id: string): Promise<void> => {
  // Buscar URL da foto
  const { data: photo } = await supabase
    .from('work_order_photos')
    .select('photo_url')
    .eq('id', id)
    .single();
    
  if (photo) {
    // Extrair caminho do arquivo da URL
    const fileUrl = new URL(photo.photo_url);
    const filePath = fileUrl.pathname.split('/').slice(2).join('/');
    
    // Excluir arquivo do storage
    const { error: storageError } = await supabase.storage
      .from('work_orders')
      .remove([filePath]);
      
    if (storageError) {
      console.error('Erro ao excluir arquivo do storage:', storageError);
    }
  }
  
  // Excluir referência do banco de dados
  const { error } = await supabase
    .from('work_order_photos')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};

// Serviço para assinatura
export const saveSignature = async (
  workOrderId: string, 
  signatureFile: File
): Promise<string> => {
  const signatureUrl = await uploadWorkOrderFile(signatureFile, `signatures/${workOrderId}`);
  
  if (!signatureUrl) {
    throw new Error('Falha ao fazer upload da assinatura');
  }
  
  // Atualizar a OS com a URL da assinatura
  await updateWorkOrder(workOrderId, {
    signature_url: signatureUrl,
    status: 'completed',
    completion_date: new Date().toISOString()
  });
  
  return signatureUrl;
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
  return data || [];
};
