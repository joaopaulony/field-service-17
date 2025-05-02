
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { 
  QuoteItem,
  CreateQuoteItemDTO,
  UpdateQuoteItemDTO
} from "@/types/quotes";

/**
 * Adds a new item to a quote
 */
export const addQuoteItem = async (item: CreateQuoteItemDTO): Promise<QuoteItem | null> => {
  try {
    console.log("Adding quote item:", item);
    const { data, error } = await supabase
      .from("quote_items")
      .insert(item)
      .select()
      .single();

    if (error) {
      console.error("Error adding quote item:", error);
      toast({
        title: "Erro ao adicionar item",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    // Update quote total
    await updateQuoteTotalAmount(item.quote_id);
    
    return data as QuoteItem;
  } catch (error: any) {
    console.error("Exception in addQuoteItem:", error);
    toast({
      title: "Erro ao adicionar item",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

/**
 * Updates an existing quote item
 */
export const updateQuoteItem = async (id: string, updates: UpdateQuoteItemDTO): Promise<boolean> => {
  try {
    console.log(`Updating quote item with id: ${id}`, updates);
    
    // Get quote_id before updating
    const { data: itemData, error: itemError } = await supabase
      .from("quote_items")
      .select("quote_id")
      .eq("id", id)
      .single();
      
    if (itemError) {
      console.error("Error fetching quote item:", itemError);
      return false;
    }
    
    // Update item
    const { error } = await supabase
      .from("quote_items")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("Error updating quote item:", error);
      toast({
        title: "Erro ao atualizar item",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    // Update quote total
    await updateQuoteTotalAmount(itemData.quote_id);
    
    return true;
  } catch (error: any) {
    console.error("Exception in updateQuoteItem:", error);
    toast({
      title: "Erro ao atualizar item",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};

/**
 * Deletes a quote item
 */
export const deleteQuoteItem = async (id: string): Promise<boolean> => {
  try {
    console.log(`Deleting quote item with id: ${id}`);
    
    // Get quote_id before deleting
    const { data: itemData, error: itemError } = await supabase
      .from("quote_items")
      .select("quote_id")
      .eq("id", id)
      .single();
      
    if (itemError) {
      console.error("Error fetching quote item:", itemError);
      return false;
    }
    
    // Delete item
    const { error } = await supabase
      .from("quote_items")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting quote item:", error);
      toast({
        title: "Erro ao excluir item",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    // Update quote total
    await updateQuoteTotalAmount(itemData.quote_id);
    
    return true;
  } catch (error: any) {
    console.error("Exception in deleteQuoteItem:", error);
    toast({
      title: "Erro ao excluir item",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};

/**
 * Updates a quote's total amount based on its items
 */
export const updateQuoteTotalAmount = async (quoteId: string): Promise<boolean> => {
  try {
    console.log(`Updating total amount for quote: ${quoteId}`);
    
    // Get all items for this quote
    const { data: items, error: itemsError } = await supabase
      .from("quote_items")
      .select("*")
      .eq("quote_id", quoteId);
      
    if (itemsError) {
      console.error("Error fetching quote items:", itemsError);
      return false;
    }
    
    // Calculate total
    let totalAmount = 0;
    for (const item of items) {
      const discountMultiplier = item.discount_percentage ? (1 - item.discount_percentage / 100) : 1;
      totalAmount += item.quantity * item.unit_price * discountMultiplier;
    }
    
    // Update quote
    const { error } = await supabase
      .from("quotes")
      .update({ total_amount: totalAmount })
      .eq("id", quoteId);
      
    if (error) {
      console.error("Error updating quote total:", error);
      return false;
    }
    
    return true;
  } catch (error: any) {
    console.error("Exception in updateQuoteTotalAmount:", error);
    return false;
  }
};
