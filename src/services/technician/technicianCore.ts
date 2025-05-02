
import { supabase } from "@/integrations/supabase/client";
import { Technician, CreateTechnicianDTO } from "@/types/workOrders";

// Fetch all technicians
export const fetchTechnicians = async (): Promise<Technician[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Usuário não autenticado');
  
  const { data, error } = await supabase
    .from('technicians')
    .select('*, skills:technician_skill_mappings(*, skill:technician_skills(*))')
    .eq('company_id', user.id)
    .order('name');
    
  if (error) throw error;
  return data as Technician[] || [];
};

// Fetch technician by ID
export const fetchTechnicianById = async (id: string): Promise<Technician | null> => {
  const { data, error } = await supabase
    .from('technicians')
    .select(`
      *, 
      skills:technician_skill_mappings(*, skill:technician_skills(*)),
      availability:technician_availability(*)
    `)
    .eq('id', id)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') return null; // Record not found
    throw error;
  }
  
  return data as Technician;
};

// Create a new technician
export const createTechnician = async (technician: CreateTechnicianDTO): Promise<Technician> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Usuário não autenticado');
  
  const { data, error } = await supabase
    .from('technicians')
    .insert({
      name: technician.name,
      email: technician.email,
      phone: technician.phone || null,
      company_id: user.id,
      bio: technician.bio || null,
      specialization: technician.specialization || null,
      hourly_rate: technician.hourly_rate || null,
      years_experience: technician.years_experience || null,
      max_daily_work_orders: technician.max_daily_work_orders || null
    })
    .select()
    .single();
    
  if (error) throw error;
  return data as Technician;
};

// Update technician
export const updateTechnician = async (id: string, technician: Partial<Technician>): Promise<Technician> => {
  const { data, error } = await supabase
    .from('technicians')
    .update({
      name: technician.name,
      email: technician.email,
      phone: technician.phone,
      active: technician.active,
      bio: technician.bio,
      specialization: technician.specialization,
      hourly_rate: technician.hourly_rate,
      years_experience: technician.years_experience,
      max_daily_work_orders: technician.max_daily_work_orders,
      profile_image_url: technician.profile_image_url
    })
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data as Technician;
};

// Delete technician
export const deleteTechnician = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('technicians')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};

// Count active technicians
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

// Fetch active technicians
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

// Fetch technicians with filters
export const fetchTechniciansWithFilters = async (
  searchTerm?: string,
  specialty?: string,
  availability?: string,
  status: 'active' | 'inactive' | 'all' = 'all'
): Promise<Technician[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Usuário não autenticado');
  
  let query = supabase
    .from('technicians')
    .select('*, skills:technician_skill_mappings(*, skill:technician_skills(*))')
    .eq('company_id', user.id);
  
  if (status !== 'all') {
    query = query.eq('active', status === 'active');
  }
  
  if (searchTerm) {
    query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);
  }
  
  if (specialty) {
    query = query.eq('specialization', specialty);
  }
  
  // Note: We'll filter by availability in memory after fetching the data
  // since it requires more complex logic with the availability table
  
  const { data, error } = await query.order('name');
  
  if (error) throw error;
  
  let technicians = data as Technician[];
  
  // Filter by availability day if specified
  if (availability) {
    const dayIndex = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      .findIndex(day => day === availability.toLowerCase());
    
    if (dayIndex !== -1) {
      // For each technician, check if they have availability for the specified day
      technicians = technicians.filter(tech => {
        if (!tech.availability) return false;
        return tech.availability.some(avail => 
          avail.day_of_week === dayIndex && avail.is_available
        );
      });
    }
  }
  
  return technicians;
};
