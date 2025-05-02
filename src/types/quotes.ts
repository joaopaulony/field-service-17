
export interface Quote {
  id: string;
  company_id: string;
  work_order_id: string | null;
  technician_id: string | null;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  address: string | null;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';
  total_amount: number;
  valid_until: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  email_sent?: boolean;
  email_sent_at?: string | null;
}

export interface QuoteItem {
  id: string;
  quote_id: string;
  inventory_item_id: string | null;
  description: string;
  quantity: number;
  unit_price: number;
  discount_percentage: number | null;
  created_at: string;
  updated_at: string;
  inventory_item?: {
    name: string;
    sku: string | null;
  };
}

export interface QuoteWithItems extends Quote {
  items: QuoteItemWithDetails[];
}

export interface QuoteItemWithDetails extends QuoteItem {
  total_price: number;
}

// Update DTO types to include company_id which is required
export interface CreateQuoteDTO {
  company_id: string; // Added company_id as it's required
  work_order_id?: string;
  technician_id?: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  address?: string;
  valid_until?: string;
  notes?: string;
  status?: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';
}

export interface UpdateQuoteDTO {
  work_order_id?: string;
  technician_id?: string;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  address?: string;
  valid_until?: string;
  notes?: string;
  status?: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';
}

export interface CreateQuoteItemDTO {
  quote_id: string;
  inventory_item_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  discount_percentage?: number;
}

export interface UpdateQuoteItemDTO {
  inventory_item_id?: string;
  description?: string;
  quantity?: number;
  unit_price?: number;
  discount_percentage?: number;
}

export interface QuoteSummary {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  expired: number;
  totalValue: number;
  approvedValue: number;
}
