
import { supabase } from "@/integrations/supabase/client";
import { TechnicianSkillMapping } from "@/types/workOrders";

// Fetch skill mappings for a technician
export const fetchTechnicianSkillMappings = async (technicianId: string): Promise<TechnicianSkillMapping[]> => {
  const { data, error } = await supabase
    .from('technician_skill_mappings')
    .select('*, skill:technician_skills(*)')
    .eq('technician_id', technicianId);
    
  if (error) throw error;
  return data as TechnicianSkillMapping[] || [];
};

// Assign a skill to a technician
export const assignSkillToTechnician = async (
  technicianId: string, 
  skillId: string, 
  proficiencyLevel: number = 1
): Promise<TechnicianSkillMapping> => {
  const { data, error } = await supabase
    .from('technician_skill_mappings')
    .insert({
      technician_id: technicianId,
      skill_id: skillId,
      proficiency_level: proficiencyLevel
    })
    .select('*, skill:technician_skills(*)')
    .single();
    
  if (error) throw error;
  return data as TechnicianSkillMapping;
};

// Update a technician's skill proficiency
export const updateTechnicianSkillProficiency = async (
  mappingId: string, 
  proficiencyLevel: number
): Promise<TechnicianSkillMapping> => {
  const { data, error } = await supabase
    .from('technician_skill_mappings')
    .update({
      proficiency_level: proficiencyLevel
    })
    .eq('id', mappingId)
    .select('*, skill:technician_skills(*)')
    .single();
    
  if (error) throw error;
  return data as TechnicianSkillMapping;
};

// Remove a skill from a technician
export const removeSkillFromTechnician = async (mappingId: string): Promise<void> => {
  const { error } = await supabase
    .from('technician_skill_mappings')
    .delete()
    .eq('id', mappingId);
    
  if (error) throw error;
};
