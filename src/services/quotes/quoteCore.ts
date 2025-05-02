
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { 
  Quote, 
  QuoteWithItems, 
  CreateQuoteDTO, 
  UpdateQuoteDTO 
} from "@/types/quotes";

/**
 * Fetches all quotes
 */
export const getQuotes = async (): Promise<Quote[]> => {
  try {
    console.log("Fetching quotes");
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching quotes:", error);
      toast({
        title: "Erro ao buscar orçamentos",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }

    return data as Quote[];
  } catch (error: any) {
    console.error("Exception in getQuotes:", error);
    toast({
      title: "Erro ao buscar orçamentos",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
};

/**
 * Fetches a single quote with its items
 */
export const getQuote = async (id: string): Promise<QuoteWithItems | null> => {
  try {
    console.log(`Fetching quote with id: ${id}`);
    
    // Get quote
    const { data: quoteData, error: quoteError } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", id)
      .single();

    if (quoteError) {
      console.error("Error fetching quote:", quoteError);
      return null;
    }

    // Get quote items
    const { data: itemsData, error: itemsError } = await supabase
      .from("quote_items")
      .select(`
        *,
        inventory_item:inventory_item_id(name, sku)
      `)
      .eq("quote_id", id);

    if (itemsError) {
      console.error("Error fetching quote items:", itemsError);
      return null;
    }

    // Calculate total price for each item
    const items = itemsData.map(item => {
      const discountMultiplier = item.discount_percentage ? (1 - item.discount_percentage / 100) : 1;
      const totalPrice = item.quantity * item.unit_price * discountMultiplier;
      
      return {
        ...item,
        total_price: totalPrice
      };
    });

    return {
      ...quoteData,
      items
    } as QuoteWithItems;
  } catch (error: any) {
    console.error("Exception in getQuote:", error);
    return null;
  }
};

/**
 * Creates a new quote
 */
export const createQuote = async (quote: CreateQuoteDTO): Promise<Quote | null> => {
  try {
    console.log("Creating quote:", quote);
    // Get the current user data to determine company_id if not provided
    if (!quote.company_id) {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error("User not authenticated");
      }
      
      // Get the company_id from the user's company
      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .select("id")
        .eq("id", userData.user.id)
        .single();
        
      if (companyError || !companyData) {
        throw new Error("Company not found");
      }
      
      quote.company_id = companyData.id;
    }
    
    const { data, error } = await supabase
      .from("quotes")
      .insert(quote)
      .select()
      .single();

    if (error) {
      console.error("Error creating quote:", error);
      toast({
        title: "Erro ao criar orçamento",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "Orçamento criado",
      description: "O orçamento foi criado com sucesso",
    });
    
    return data as Quote;
  } catch (error: any) {
    console.error("Exception in createQuote:", error);
    toast({
      title: "Erro ao criar orçamento",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

/**
 * Updates an existing quote
 */
export const updateQuote = async (id: string, updates: UpdateQuoteDTO): Promise<boolean> => {
  try {
    console.log(`Updating quote with id: ${id}`, updates);
    const { error } = await supabase
      .from("quotes")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("Error updating quote:", error);
      toast({
        title: "Erro ao atualizar orçamento",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Orçamento atualizado",
      description: "O orçamento foi atualizado com sucesso",
    });
    
    return true;
  } catch (error: any) {
    console.error("Exception in updateQuote:", error);
    toast({
      title: "Erro ao atualizar orçamento",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};

/**
 * Deletes a quote
 */
export const deleteQuote = async (id: string): Promise<boolean> => {
  try {
    console.log(`Deleting quote with id: ${id}`);
    const { error } = await supabase
      .from("quotes")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting quote:", error);
      toast({
        title: "Erro ao excluir orçamento",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Orçamento excluído",
      description: "O orçamento foi excluído com sucesso",
    });
    
    return true;
  } catch (error: any) {
    console.error("Exception in deleteQuote:", error);
    toast({
      title: "Erro ao excluir orçamento",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};
