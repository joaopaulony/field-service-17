
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Plan feature limits
export interface PlanLimits {
  maxTechnicians: number;
  maxWorkOrdersPerMonth: number | null; // null means unlimited
  allowPdfExport: boolean;
  allowApiIntegration: boolean;
  hasDedicatedSupport: boolean;
}

// Plan types from Database
export type PlanType = 'free' | 'basic' | 'professional' | 'enterprise';

// Plan limits configuration
export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    maxTechnicians: 1,
    maxWorkOrdersPerMonth: 5,
    allowPdfExport: false,
    allowApiIntegration: false,
    hasDedicatedSupport: false
  },
  basic: {
    maxTechnicians: 5,
    maxWorkOrdersPerMonth: null, // unlimited
    allowPdfExport: false,
    allowApiIntegration: false,
    hasDedicatedSupport: false
  },
  professional: {
    maxTechnicians: 20,
    maxWorkOrdersPerMonth: null, // unlimited
    allowPdfExport: true,
    allowApiIntegration: false,
    hasDedicatedSupport: false
  },
  enterprise: {
    maxTechnicians: 999, // practically unlimited
    maxWorkOrdersPerMonth: null, // unlimited
    allowPdfExport: true,
    allowApiIntegration: true,
    hasDedicatedSupport: true
  }
};

// Get the company's current plan
export const getCompanyPlan = async (): Promise<PlanType> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return 'free'; // Default to free plan for unauthenticated users
  }
  
  const { data, error } = await supabase
    .from('companies')
    .select('plan')
    .eq('id', user.id)
    .single();
    
  if (error || !data) {
    console.error('Error fetching company plan:', error);
    return 'free'; // Default to free plan if there's an error
  }
  
  return (data as any).plan as PlanType;
};

// Get the company's plan limits
export const getPlanLimits = async (): Promise<PlanLimits> => {
  const plan = await getCompanyPlan();
  return PLAN_LIMITS[plan];
};

// Check if the company can add more technicians
export const canAddTechnician = async (): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return false;
  }
  
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('plan')
    .eq('id', user.id)
    .single();
    
  if (companyError || !company) {
    console.error('Error fetching company:', companyError);
    return false;
  }
  
  const planLimits = PLAN_LIMITS[(company as any).plan as PlanType];
  
  // Count current technicians
  const { data: technicians, error: techniciansError } = await supabase
    .from('technicians')
    .select('id')
    .eq('company_id', user.id)
    .eq('active', true);
    
  if (techniciansError) {
    console.error('Error counting technicians:', techniciansError);
    return false;
  }
  
  return (technicians?.length || 0) < planLimits.maxTechnicians;
};

// Check if the company can create more work orders this month
export const canCreateWorkOrder = async (): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return false;
  }
  
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('plan')
    .eq('id', user.id)
    .single();
    
  if (companyError || !company) {
    console.error('Error fetching company:', companyError);
    return false;
  }
  
  const planLimits = PLAN_LIMITS[(company as any).plan as PlanType];
  
  // If the plan has unlimited work orders
  if (planLimits.maxWorkOrdersPerMonth === null) {
    return true;
  }
  
  // Calculate the first day of the current month
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  
  // Count work orders created this month
  const { data: workOrders, error: workOrdersError } = await supabase
    .from('work_orders')
    .select('id')
    .eq('company_id', user.id)
    .gte('created_at', firstDayOfMonth);
    
  if (workOrdersError) {
    console.error('Error counting work orders:', workOrdersError);
    return false;
  }
  
  return (workOrders?.length || 0) < planLimits.maxWorkOrdersPerMonth;
};

// Check if the company's plan allows PDF exports
export const canExportPDF = async (): Promise<boolean> => {
  const planLimits = await getPlanLimits();
  return planLimits.allowPdfExport;
};

// Check if the company's plan allows API integration
export const canUseApiIntegration = async (): Promise<boolean> => {
  const planLimits = await getPlanLimits();
  return planLimits.allowApiIntegration;
};

// Check if the company's plan has dedicated support
export const hasDedicatedSupport = async (): Promise<boolean> => {
  const planLimits = await getPlanLimits();
  return planLimits.hasDedicatedSupport;
};

// Show upgrade plan alert
export const showUpgradePlanAlert = (feature: string): void => {
  toast.error(`Recurso não disponível no seu plano atual: ${feature}`, {
    description: "Atualize seu plano para acessar essa funcionalidade.",
    action: {
      label: "Upgrade",
      onClick: () => window.location.href = "/dashboard/account/billing",
    },
  });
};
