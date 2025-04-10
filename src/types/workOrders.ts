
import { Database } from "@/integrations/supabase/types";

export type WorkOrderStatus = Database["public"]["Enums"]["work_order_status"];

export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  active: boolean;
  company_id: string;
  created_at: string;
  updated_at: string;
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
}

export interface CreateTechnicianDTO {
  name: string;
  email: string;
  phone?: string;
}
