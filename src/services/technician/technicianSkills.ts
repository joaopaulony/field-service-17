
import { supabase } from "@/integrations/supabase/client";
import { TechnicianSkill } from "@/types/workOrders";

// Fetch all skills for a company
export const fetchTechnicianSkills = async (): Promise<TechnicianSkill[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Usuário não autenticado');
  
  const { data, error } = await supabase
    .from('technician_skills')
    .select('*')
    .eq('company_id', user.id)
    .order('name');
    
  if (error) throw error;
  return data as TechnicianSkill[] || [];
};

// Fetch skill by ID
export const fetchTechnicianSkillById = async (id: string): Promise<TechnicianSkill | null> => {
  const { data, error } = await supabase
    .from('technician_skills')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') return null; // Record not found
    throw error;
  }
  
  return data as TechnicianSkill;
};

// Create a new skill
export const createTechnicianSkill = async (name: string, description?: string): Promise<TechnicianSkill> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Usuário não autenticado');
  
  const { data, error } = await supabase
    .from('technician_skills')
    .insert({
      name,
      description: description || null,
      company_id: user.id
    })
    .select()
    .single();
    
  if (error) throw error;
  return data as TechnicianSkill;
};

// Update a skill
export const updateTechnicianSkill = async (id: string, name: string, description?: string): Promise<TechnicianSkill> => {
  const { data, error } = await supabase
    .from('technician_skills')
    .update({
      name,
      description: description || null
    })
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data as TechnicianSkill;
};

// Delete a skill
export const deleteTechnicianSkill = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('technician_skills')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};
