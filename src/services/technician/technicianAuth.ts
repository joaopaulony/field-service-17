
import { supabase } from "@/integrations/supabase/client";
import { Technician } from "@/types/workOrders";

// Fetch technician by user's email
export const fetchTechnicianByEmail = async (email: string): Promise<Technician | null> => {
  const { data, error } = await supabase
    .from('technicians')
    .select(`
      *, 
      skills:technician_skill_mappings(*, skill:technician_skills(*)),
      availability:technician_availability(*)
    `)
    .eq('email', email)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') return null; // Record not found
    throw error;
  }
  
  return data as Technician;
};

// This function will be used to identify if a logged in user is a technician
export const getCurrentTechnician = async (): Promise<Technician | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  try {
    const technician = await fetchTechnicianByEmail(user.email || '');
    return technician;
  } catch (error) {
    console.error('Error fetching current technician:', error);
    return null;
  }
};
