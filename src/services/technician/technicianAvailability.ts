
import { supabase } from "@/integrations/supabase/client";
import { TechnicianAvailability } from "@/types/workOrders";

// Fetch availability for a technician
export const fetchTechnicianAvailability = async (technicianId: string): Promise<TechnicianAvailability[]> => {
  const { data, error } = await supabase
    .from('technician_availability')
    .select('*')
    .eq('technician_id', technicianId)
    .order('day_of_week')
    .order('start_time');
    
  if (error) throw error;
  return data as TechnicianAvailability[] || [];
};

// Set a technician's availability time slot
export const setTechnicianAvailability = async (
  technicianId: string,
  dayOfWeek: number,
  startTime: string,
  endTime: string,
  isAvailable: boolean = true
): Promise<TechnicianAvailability> => {
  const { data, error } = await supabase
    .from('technician_availability')
    .insert({
      technician_id: technicianId,
      day_of_week: dayOfWeek,
      start_time: startTime,
      end_time: endTime,
      is_available: isAvailable
    })
    .select()
    .single();
    
  if (error) throw error;
  return data as TechnicianAvailability;
};

// Update a technician's availability
export const updateTechnicianAvailability = async (
  availabilityId: string,
  updates: Partial<TechnicianAvailability>
): Promise<TechnicianAvailability> => {
  const { data, error } = await supabase
    .from('technician_availability')
    .update({
      day_of_week: updates.day_of_week,
      start_time: updates.start_time,
      end_time: updates.end_time,
      is_available: updates.is_available
    })
    .eq('id', availabilityId)
    .select()
    .single();
    
  if (error) throw error;
  return data as TechnicianAvailability;
};
