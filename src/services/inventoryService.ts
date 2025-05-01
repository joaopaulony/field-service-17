
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { 
  InventoryItem, 
  InventoryCategory, 
  InventoryMovement,
  CreateInventoryItemDTO,
  UpdateInventoryItemDTO,
  CreateInventoryCategoryDTO,
  UpdateInventoryCategoryDTO,
  CreateInventoryMovementDTO,
  InventoryItemWithCategory,
  InventorySummary
} from "@/types/inventory";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Inventory Items
export const getInventoryItems = async (): Promise<InventoryItemWithCategory[]> => {
  try {
    console.log("Fetching inventory items");
    const { data, error } = await supabase
      .from("inventory_items")
      .select(`
        *,
        category:category_id(id, name, description)
      `)
      .order("name");

    if (error) {
      console.error("Error fetching inventory items:", error);
      toast({
        title: "Erro ao buscar itens",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
    
    console.log(`Retrieved ${data.length} inventory items`);
    return data as InventoryItemWithCategory[];
  } catch (error: any) {
    console.error("Exception in getInventoryItems:", error);
    toast({
      title: "Erro ao buscar itens",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
};

export const getInventoryItem = async (id: string): Promise<InventoryItemWithCategory | null> => {
  try {
    console.log(`Fetching inventory item with id: ${id}`);
    const { data, error } = await supabase
      .from("inventory_items")
      .select(`
        *,
        category:category_id(id, name, description)
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching inventory item:", error);
      return null;
    }

    return data as InventoryItemWithCategory;
  } catch (error: any) {
    console.error("Exception in getInventoryItem:", error);
    return null;
  }
};

export const createInventoryItem = async (item: CreateInventoryItemDTO): Promise<InventoryItem | null> => {
  try {
    console.log("Creating inventory item:", item);
    // Get the current user data to get the company_id
    const { data: userData } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from("inventory_items")
      .insert(item)
      .select()
      .single();

    if (error) {
      console.error("Error creating inventory item:", error);
      toast({
        title: "Erro ao criar item",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "Item criado",
      description: "O item foi criado com sucesso",
    });
    
    return data as InventoryItem;
  } catch (error: any) {
    console.error("Exception in createInventoryItem:", error);
    toast({
      title: "Erro ao criar item",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

export const updateInventoryItem = async (id: string, updates: UpdateInventoryItemDTO): Promise<boolean> => {
  try {
    console.log(`Updating inventory item with id: ${id}`, updates);
    const { error } = await supabase
      .from("inventory_items")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("Error updating inventory item:", error);
      toast({
        title: "Erro ao atualizar item",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Item atualizado",
      description: "O item foi atualizado com sucesso",
    });
    
    return true;
  } catch (error: any) {
    console.error("Exception in updateInventoryItem:", error);
    toast({
      title: "Erro ao atualizar item",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};

export const deleteInventoryItem = async (id: string): Promise<boolean> => {
  try {
    console.log(`Deleting inventory item with id: ${id}`);
    const { error } = await supabase
      .from("inventory_items")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting inventory item:", error);
      toast({
        title: "Erro ao excluir item",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Item excluído",
      description: "O item foi excluído com sucesso",
    });
    
    return true;
  } catch (error: any) {
    console.error("Exception in deleteInventoryItem:", error);
    toast({
      title: "Erro ao excluir item",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};

// Inventory Categories
export const getInventoryCategories = async (): Promise<InventoryCategory[]> => {
  try {
    console.log("Fetching inventory categories");
    const { data, error } = await supabase
      .from("inventory_categories")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching inventory categories:", error);
      return [];
    }

    return data as InventoryCategory[];
  } catch (error: any) {
    console.error("Exception in getInventoryCategories:", error);
    return [];
  }
};

export const createInventoryCategory = async (category: CreateInventoryCategoryDTO): Promise<InventoryCategory | null> => {
  try {
    console.log("Creating inventory category:", category);
    // Get the current user data to determine company_id
    const { data: userData } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from("inventory_categories")
      .insert(category)
      .select()
      .single();

    if (error) {
      console.error("Error creating inventory category:", error);
      toast({
        title: "Erro ao criar categoria",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "Categoria criada",
      description: "A categoria foi criada com sucesso",
    });
    
    return data as InventoryCategory;
  } catch (error: any) {
    console.error("Exception in createInventoryCategory:", error);
    toast({
      title: "Erro ao criar categoria",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

export const updateInventoryCategory = async (id: string, updates: UpdateInventoryCategoryDTO): Promise<boolean> => {
  try {
    console.log(`Updating inventory category with id: ${id}`, updates);
    const { error } = await supabase
      .from("inventory_categories")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("Error updating inventory category:", error);
      toast({
        title: "Erro ao atualizar categoria",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Categoria atualizada",
      description: "A categoria foi atualizada com sucesso",
    });
    
    return true;
  } catch (error: any) {
    console.error("Exception in updateInventoryCategory:", error);
    toast({
      title: "Erro ao atualizar categoria",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};

export const deleteInventoryCategory = async (id: string): Promise<boolean> => {
  try {
    console.log(`Deleting inventory category with id: ${id}`);
    const { error } = await supabase
      .from("inventory_categories")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting inventory category:", error);
      toast({
        title: "Erro ao excluir categoria",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Categoria excluída",
      description: "A categoria foi excluída com sucesso",
    });
    
    return true;
  } catch (error: any) {
    console.error("Exception in deleteInventoryCategory:", error);
    toast({
      title: "Erro ao excluir categoria",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};

// Inventory Movements
export const createInventoryMovement = async (movement: CreateInventoryMovementDTO): Promise<InventoryMovement | null> => {
  try {
    console.log("Creating inventory movement:", movement);
    
    // Start a transaction for updating both movement and item
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error("User not authenticated");
    }
    
    // Get current quantity
    const { data: itemData, error: itemError } = await supabase
      .from("inventory_items")
      .select("quantity")
      .eq("id", movement.item_id)
      .single();
      
    if (itemError) {
      throw new Error(`Error fetching item: ${itemError.message}`);
    }
    
    // Calculate new quantity
    let newQuantity = itemData.quantity;
    if (movement.movement_type === 'in') {
      newQuantity += movement.quantity;
    } else if (movement.movement_type === 'out') {
      newQuantity -= movement.quantity;
      if (newQuantity < 0) {
        throw new Error("Quantidade insuficiente em estoque");
      }
    } else if (movement.movement_type === 'adjust') {
      newQuantity = movement.quantity; // Direct adjustment
    }
    
    // Update item quantity
    const { error: updateError } = await supabase
      .from("inventory_items")
      .update({ quantity: newQuantity })
      .eq("id", movement.item_id);
      
    if (updateError) {
      throw new Error(`Error updating item quantity: ${updateError.message}`);
    }
    
    // Create movement record with company_id
    const { data, error } = await supabase
      .from("inventory_movements")
      .insert({
        ...movement,
        company_id: movement.company_id
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating movement: ${error.message}`);
    }

    toast({
      title: "Movimento registrado",
      description: "O movimento de estoque foi registrado com sucesso",
    });
    
    return data as InventoryMovement;
  } catch (error: any) {
    console.error("Exception in createInventoryMovement:", error);
    toast({
      title: "Erro ao registrar movimento",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

export const getInventoryMovements = async (itemId?: string): Promise<InventoryMovement[]> => {
  try {
    console.log(`Fetching inventory movements${itemId ? ` for item ${itemId}` : ''}`);
    
    let query = supabase
      .from("inventory_movements")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (itemId) {
      query = query.eq("item_id", itemId);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error("Error fetching inventory movements:", error);
      return [];
    }

    return data as InventoryMovement[];
  } catch (error: any) {
    console.error("Exception in getInventoryMovements:", error);
    return [];
  }
};

// Inventory Summary
export const getInventorySummary = async (): Promise<InventorySummary> => {
  try {
    console.log("Fetching inventory summary");
    
    // Get all items
    const { data: items, error } = await supabase
      .from("inventory_items")
      .select("*");
      
    if (error) {
      console.error("Error fetching inventory items for summary:", error);
      return {
        totalItems: 0,
        lowStockItems: 0,
        totalValue: 0,
        activeItems: 0,
        discontinuedItems: 0
      };
    }
    
    // Calculate summary
    const summary: InventorySummary = {
      totalItems: items.length,
      lowStockItems: items.filter(i => i.quantity <= i.min_quantity).length,
      totalValue: items.reduce((total, item) => total + (item.cost_price * item.quantity), 0),
      activeItems: items.filter(i => i.status === 'active').length,
      discontinuedItems: items.filter(i => i.status === 'discontinued').length
    };
    
    return summary;
  } catch (error: any) {
    console.error("Exception in getInventorySummary:", error);
    return {
      totalItems: 0,
      lowStockItems: 0,
      totalValue: 0,
      activeItems: 0,
      discontinuedItems: 0
    };
  }
};

// Export functions
export const exportInventoryToExcel = (items: InventoryItemWithCategory[]): void => {
  try {
    console.log("Exporting inventory to Excel");
    
    // Prepare data for export
    const exportData = items.map(item => ({
      'Nome': item.name,
      'SKU': item.sku || '',
      'Categoria': item.category?.name || '',
      'Quantidade': item.quantity,
      'Quantidade Mínima': item.min_quantity,
      'Preço de Custo': `R$ ${item.cost_price.toFixed(2)}`,
      'Preço de Venda': `R$ ${item.unit_price.toFixed(2)}`,
      'Status': item.status === 'active' ? 'Ativo' : item.status === 'discontinued' ? 'Descontinuado' : 'Estoque Baixo',
      'Valor Total': `R$ ${(item.quantity * item.cost_price).toFixed(2)}`
    }));
    
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Estoque");
    
    // Generate file name
    const date = new Date().toISOString().split('T')[0];
    const fileName = `inventario_${date}.xlsx`;
    
    // Export to file
    XLSX.writeFile(workbook, fileName);
    
    toast({
      title: "Exportação concluída",
      description: `Os dados do estoque foram exportados para ${fileName}`,
    });
  } catch (error: any) {
    console.error("Exception in exportInventoryToExcel:", error);
    toast({
      title: "Erro na exportação",
      description: error.message,
      variant: "destructive",
    });
  }
};

export const exportInventoryToPDF = (items: InventoryItemWithCategory[]): void => {
  try {
    console.log("Exporting inventory to PDF");
    
    // Create PDF document
    const doc = new jsPDF();
    
    // Add title
    const date = new Date().toLocaleDateString('pt-BR');
    doc.setFontSize(18);
    doc.text("Relatório de Estoque", 14, 22);
    doc.setFontSize(11);
    doc.text(`Gerado em: ${date}`, 14, 30);
    
    // Prepare data for table
    const tableData = items.map(item => [
      item.name,
      item.sku || '',
      item.category?.name || '',
      item.quantity.toString(),
      `R$ ${item.unit_price.toFixed(2)}`,
      item.status === 'active' ? 'Ativo' : item.status === 'discontinued' ? 'Descontinuado' : 'Estoque Baixo',
      `R$ ${(item.quantity * item.cost_price).toFixed(2)}`
    ]);
    
    // Add table
    (doc as any).autoTable({
      startY: 40,
      head: [['Nome', 'SKU', 'Categoria', 'Qtd', 'Preço', 'Status', 'Valor Total']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [139, 92, 246] }
    });
    
    // Calculate summary
    const totalItems = items.length;
    const totalValue = items.reduce((total, item) => total + (item.cost_price * item.quantity), 0);
    const lowStockItems = items.filter(i => i.quantity <= i.min_quantity).length;
    
    // Add summary
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Total de Itens: ${totalItems}`, 14, finalY);
    doc.text(`Itens com Estoque Baixo: ${lowStockItems}`, 14, finalY + 7);
    doc.text(`Valor Total do Estoque: R$ ${totalValue.toFixed(2)}`, 14, finalY + 14);
    
    // Generate file name and save
    const fileName = `inventario_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    toast({
      title: "Exportação concluída",
      description: `Os dados do estoque foram exportados para ${fileName}`,
    });
  } catch (error: any) {
    console.error("Exception in exportInventoryToPDF:", error);
    toast({
      title: "Erro na exportação",
      description: error.message,
      variant: "destructive",
    });
  }
};
