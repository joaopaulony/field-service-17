
import { supabase } from "@/integrations/supabase/client";
import { QuoteSummary } from "@/types/quotes";

/**
 * Gets a summary of quotes (counts and values)
 */
export const getQuoteSummary = async (): Promise<QuoteSummary> => {
  try {
    console.log("Fetching quote summary");
    
    // Get all quotes
    const { data: quotes, error } = await supabase
      .from("quotes")
      .select("*");
      
    if (error) {
      console.error("Error fetching quotes for summary:", error);
      return {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        expired: 0,
        totalValue: 0,
        approvedValue: 0
      };
    }
    
    // Calculate summary
    const summary: QuoteSummary = {
      total: quotes.length,
      pending: quotes.filter(q => q.status === 'draft' || q.status === 'sent').length,
      approved: quotes.filter(q => q.status === 'approved').length,
      rejected: quotes.filter(q => q.status === 'rejected').length,
      expired: quotes.filter(q => q.status === 'expired').length,
      totalValue: quotes.reduce((total, quote) => total + quote.total_amount, 0),
      approvedValue: quotes.filter(q => q.status === 'approved').reduce((total, quote) => total + quote.total_amount, 0)
    };
    
    return summary;
  } catch (error: any) {
    console.error("Exception in getQuoteSummary:", error);
    return {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      expired: 0,
      totalValue: 0,
      approvedValue: 0
    };
  }
};
