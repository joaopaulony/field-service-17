
export interface InventoryCategory {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  id: string;
  company_id: string;
  category_id: string | null;
  name: string;
  sku: string | null;
  description: string | null;
  unit_price: number;
  cost_price: number;
  image_url: string | null;
  status: 'active' | 'discontinued' | 'low_stock';
  quantity: number;
  min_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface InventoryMovement {
  id: string;
  company_id: string;
  item_id: string;
  quantity: number;
  movement_type: 'in' | 'out' | 'adjust';
  reference_type: string | null;
  reference_id: string | null;
  notes: string | null;
  created_by_id: string | null;
  created_at: string;
}

export interface InventoryItemWithCategory extends InventoryItem {
  category?: InventoryCategory;
}

export interface InventorySummary {
  totalItems: number;
  lowStockItems: number;
  totalValue: number;
  activeItems: number;
  discontinuedItems: number;
}

export type CreateInventoryItemDTO = Omit<InventoryItem, 'id' | 'company_id' | 'created_at' | 'updated_at'>;
export type UpdateInventoryItemDTO = Partial<CreateInventoryItemDTO>;

export type CreateInventoryCategoryDTO = Omit<InventoryCategory, 'id' | 'company_id' | 'created_at' | 'updated_at'>;
export type UpdateInventoryCategoryDTO = Partial<CreateInventoryCategoryDTO>;

export interface CreateInventoryMovementDTO {
  item_id: string;
  quantity: number;
  movement_type: 'in' | 'out' | 'adjust';
  reference_type?: string;
  reference_id?: string;
  notes?: string;
}
