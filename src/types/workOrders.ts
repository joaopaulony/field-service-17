
import { Database } from "@/integrations/supabase/types";

export type WorkOrderStatus = Database["public"]["Enums"]["work_order_status"];

export interface TechnicianSkill {
  id: string;
  name: string;
  description: string | null;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface TechnicianSkillMapping {
  id: string;
  technician_id: string;
  skill_id: string;
  proficiency_level: number;
  created_at: string;
  updated_at: string;
  skill?: TechnicianSkill;
}

export interface TechnicianAvailability {
  id: string;
  technician_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface TechnicianPerformance {
  id: string;
  technician_id: string;
  period_start: string;
  period_end: string;
  completed_work_orders: number;
  average_completion_time_minutes: number;
  customer_satisfaction_rating: number;
  revenue_generated: number;
  created_at: string;
  updated_at: string;
}

export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  active: boolean;
  company_id: string;
  created_at: string;
  updated_at: string;
  bio: string | null;
  profile_image_url: string | null;
  specialization: string | null;
  hourly_rate: number | null;
  years_experience: number | null;
  max_daily_work_orders: number | null;
  skills?: TechnicianSkillMapping[];
  availability?: TechnicianAvailability[];
  performance?: TechnicianPerformance[];
}

export interface WorkOrder {
  id: string;
  title: string;
  description: string | null;
  status: WorkOrderStatus;
  company_id: string;
  technician_id: string | null;
  scheduled_date: string | null;
  location: string | null;
  client_name: string | null;
  signature_url: string | null;
  completion_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  technician?: Technician;
  photos?: WorkOrderPhoto[];
  start_latitude?: number | null;
  start_longitude?: number | null;
  completion_latitude?: number | null;
  completion_longitude?: number | null;
}

export interface WorkOrderPhoto {
  id: string;
  work_order_id: string;
  photo_url: string;
  description: string | null;
  created_at: string;
}

export interface CreateWorkOrderDTO {
  title: string;
  description?: string;
  client_name?: string;
  location?: string;
  technician_id?: string;
  scheduled_date?: string;
}

export interface UpdateWorkOrderDTO {
  title?: string;
  description?: string;
  status?: WorkOrderStatus;
  client_name?: string;
  location?: string;
  technician_id?: string;
  scheduled_date?: string;
  notes?: string;
  completion_date?: string;
  signature_url?: string;
  start_latitude?: number | null;
  start_longitude?: number | null;
  completion_latitude?: number | null;
  completion_longitude?: number | null;
}

export interface CreateTechnicianDTO {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  specialization?: string;
  hourly_rate?: number;
  years_experience?: number;
  max_daily_work_orders?: number;
}

export interface TechnicianFilters {
  searchTerm?: string;
  specialty?: string;
  availability?: string;
  status?: 'active' | 'inactive' | 'all';
}
