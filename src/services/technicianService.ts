
import { supabase } from "@/integrations/supabase/client";
import { Technician, CreateTechnicianDTO } from "@/types/workOrders";

// Buscar todos os técnicos
export const fetchTechnicians = async (): Promise<Technician[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Usuário não autenticado');
  
  const { data, error } = await supabase
    .from('technicians')
    .select('*')
    .eq('company_id', user.id)
    .order('name');
    
  if (error) throw error;
  return data as Technician[] || [];
};

// Buscar técnico por ID
export const fetchTechnicianById = async (id: string): Promise<Technician | null> => {
  const { data, error } = await supabase
    .from('technicians')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') return null; // Registro não encontrado
    throw error;
  }
  
  return data as Technician;
};

// Criar um novo técnico
export const createTechnician = async (technician: CreateTechnicianDTO): Promise<Technician> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Usuário não autenticado');
  
  const { data, error } = await supabase
    .from('technicians')
    .insert({
      name: technician.name,
      email: technician.email,
      phone: technician.phone,
      company_id: user.id
    })
    .select()
    .single();
    
  if (error) throw error;
  return data as Technician;
};

// Atualizar técnico
export const updateTechnician = async (id: string, technician: Partial<Technician>): Promise<Technician> => {
  const { data, error } = await supabase
    .from('technicians')
    .update({
      name: technician.name,
      email: technician.email,
      phone: technician.phone,
      active: technician.active
    })
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data as Technician;
};

// Excluir técnico
export const deleteTechnician = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('technicians')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};

// Contar técnicos ativos
export const countActiveTechnicians = async (): Promise<number> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Usuário não autenticado');
  
  const { count, error } = await supabase
    .from('technicians')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', user.id)
    .eq('active', true);
    
  if (error) throw error;
  return count || 0;
};

// Buscar técnicos ativos
export const fetchActiveTechnicians = async (): Promise<Technician[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Usuário não autenticado');
  
  const { data, error } = await supabase
    .from('technicians')
    .select('*')
    .eq('company_id', user.id)
    .eq('active', true)
    .order('name');
    
  if (error) throw error;
  return data as Technician[] || [];
};
