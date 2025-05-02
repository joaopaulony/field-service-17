
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

// Create a new Supabase auth account for the technician
export const createTechnicianAuthAccount = async (email: string, password: string): Promise<string | null> => {
  // Create a new user account
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        user_type: 'technician',
      }
    }
  });
  
  if (authError) {
    console.error('Error creating technician auth account:', authError);
    throw authError;
  }
  
  return authData?.user?.id || null;
};
