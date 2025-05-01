
import { supabase } from "@/integrations/supabase/client";
import { Technician, CreateTechnicianDTO } from "@/types/workOrders";
import { canAddTechnician } from "@/services/planService";

export const fetchTechnicians = async (): Promise<Technician[]> => {
  const { data, error } = await supabase
    .from('technicians')
    .select('*')
    .order('name');
    
  if (error) throw error;
  return data || [];
};

export const createTechnician = async (technician: CreateTechnicianDTO): Promise<Technician> => {
  // Get the authenticated user's ID to use as company_id
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Usuário não autenticado');
  
  // Check if the company can add more technicians
  const canAdd = await canAddTechnician();
  if (!canAdd) {
    throw new Error('Limite de técnicos para o plano atingido');
  }
  
  const { data, error } = await supabase
    .from('technicians')
    .insert({
      company_id: user.id,
      name: technician.name,
      email: technician.email,
      phone: technician.phone
    })
    .select()
    .single();
    
  if (error) throw error;
  return data as unknown as Technician;
};

export const updateTechnician = async (id: string, updates: Partial<Technician>): Promise<Technician> => {
  const { data, error } = await supabase
    .from('technicians')
    .update(updates as any)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data as unknown as Technician;
};

export const deleteTechnician = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('technicians')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};
