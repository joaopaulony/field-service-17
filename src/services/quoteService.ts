
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { 
  Quote, 
  QuoteItem, 
  CreateQuoteDTO, 
  UpdateQuoteDTO,
  CreateQuoteItemDTO,
  UpdateQuoteItemDTO,
  QuoteWithItems,
  QuoteItemWithDetails,
  QuoteSummary
} from "@/types/quotes";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Company } from "./companyService";

// Quotes
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

// Quote Items
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

// Helpers
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

// Export to PDF
export const generateQuotePDF = async (quoteId: string): Promise<string | Blob | null> => {
  try {
    console.log(`Generating PDF for quote: ${quoteId}`);
    
    // Get quote with items
    const quote = await getQuote(quoteId);
    if (!quote) {
      throw new Error("Orçamento não encontrado");
    }
    
    // Get company info
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("*")
      .eq("id", quote.company_id)
      .single();
      
    if (companyError) {
      console.error("Error fetching company:", companyError);
      throw new Error("Dados da empresa não encontrados");
    }
    
    // Create PDF
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(22);
    doc.text("ORÇAMENTO", 105, 20, { align: "center" });
    
    // Add company info
    doc.setFontSize(12);
    doc.text(`${company.name}`, 14, 30);
    if (company.phone) doc.text(`Tel: ${company.phone}`, 14, 35);
    if (company.email) doc.text(`Email: ${company.email}`, 14, 40);
    if (company.address) {
      let addressLine = `${company.address}`;
      if (company.city) addressLine += `, ${company.city}`;
      if (company.state) addressLine += ` - ${company.state}`;
      doc.text(addressLine, 14, 45);
    }
    
    // Add quote info
    doc.setFontSize(10);
    doc.text(`ORÇAMENTO #: ${quoteId.substring(0, 8)}`, 150, 30, { align: "right" });
    doc.text(`DATA: ${new Date(quote.created_at).toLocaleDateString('pt-BR')}`, 150, 35, { align: "right" });
    if (quote.valid_until) {
      doc.text(`VÁLIDO ATÉ: ${new Date(quote.valid_until).toLocaleDateString('pt-BR')}`, 150, 40, { align: "right" });
    }
    doc.text(`STATUS: ${getStatusInPortuguese(quote.status)}`, 150, 45, { align: "right" });
    
    // Add separator line
    doc.setLineWidth(0.5);
    doc.line(14, 50, 196, 50);
    
    // Add client info
    doc.setFontSize(12);
    doc.text("CLIENTE:", 14, 60);
    doc.text(`${quote.client_name}`, 14, 65);
    if (quote.client_phone) doc.text(`Tel: ${quote.client_phone}`, 14, 70);
    if (quote.client_email) doc.text(`Email: ${quote.client_email}`, 14, 75);
    if (quote.address) doc.text(`Endereço: ${quote.address}`, 14, 80);
    
    // Add items table
    const tableData = quote.items.map(item => {
      const discountMultiplier = item.discount_percentage ? (1 - item.discount_percentage / 100) : 1;
      const totalPrice = item.quantity * item.unit_price * discountMultiplier;
      const inventoryText = item.inventory_item ? ` (${item.inventory_item.name})` : '';
      
      return [
        item.description + inventoryText,
        item.quantity.toString(),
        `R$ ${item.unit_price.toFixed(2)}`,
        item.discount_percentage ? `${item.discount_percentage}%` : "-",
        `R$ ${totalPrice.toFixed(2)}`
      ];
    });
    
    // Add table
    (doc as any).autoTable({
      startY: 90,
      head: [['Descrição', 'Qtd', 'Preço Unit.', 'Desconto', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [139, 92, 246], textColor: [255, 255, 255] },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { halign: 'center' },
        2: { halign: 'right' },
        3: { halign: 'center' },
        4: { halign: 'right' }
      },
      didDrawPage: function(data: any) {
        // Footer on each page
        doc.setFontSize(8);
        doc.text(`Orçamento gerado em ${new Date().toLocaleDateString('pt-BR')}`, 105, 290, { align: 'center' });
      }
    });
    
    // Add total
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`Valor Total: R$ ${quote.total_amount.toFixed(2)}`, 150, finalY, { align: "right" });
    
    // Add notes if any
    if (quote.notes) {
      doc.setFont(undefined, 'normal');
      doc.setFontSize(11);
      doc.text("OBSERVAÇÕES:", 14, finalY + 15);
      doc.setFontSize(10);
      
      // Handle multiline notes
      const splitNotes = doc.splitTextToSize(quote.notes, 170);
      doc.text(splitNotes, 14, finalY + 22);
    }
    
    // Generate file name
    const fileName = `orcamento_${quote.id.substring(0, 8)}.pdf`;
    
    // Save PDF (for download option)
    const pdfBlob = doc.output('blob');
    
    toast({
      title: "PDF gerado com sucesso",
      description: `O orçamento foi exportado para ${fileName}`,
    });
    
    return pdfBlob;
  } catch (error: any) {
    console.error("Exception in generateQuotePDF:", error);
    toast({
      title: "Erro ao gerar PDF",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

// Download PDF for a quote
export const downloadQuotePDF = async (quoteId: string): Promise<void> => {
  try {
    const pdfBlob = await generateQuotePDF(quoteId);
    if (pdfBlob instanceof Blob) {
      const fileName = `orcamento_${quoteId.substring(0, 8)}.pdf`;
      const url = URL.createObjectURL(pdfBlob);
      
      // Create an anchor element and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  } catch (error: any) {
    console.error("Error downloading quote PDF:", error);
    toast({
      title: "Erro ao baixar PDF",
      description: error.message,
      variant: "destructive",
    });
  }
};

// Send quote via email
export const sendQuoteByEmail = async (
  quoteId: string, 
  recipientEmail: string,
  subject?: string,
  message?: string
): Promise<boolean> => {
  try {
    console.log(`Sending quote email for quote: ${quoteId} to ${recipientEmail}`);
    
    // Generate the PDF
    const pdfBlob = await generateQuotePDF(quoteId);
    if (!pdfBlob || !(pdfBlob instanceof Blob)) {
      throw new Error("Falha ao gerar PDF do orçamento");
    }
    
    // Convert PDF blob to base64
    const reader = new FileReader();
    const pdfBase64Promise = new Promise<string>((resolve, reject) => {
      reader.onloadend = () => {
        const base64data = reader.result as string;
        const base64Content = base64data.split(';base64,')[1] || base64data;
        resolve(base64Content);
      };
      reader.onerror = reject;
      reader.readAsDataURL(pdfBlob);
    });
    
    const pdfBase64 = await pdfBase64Promise;
    
    // Call the edge function to send the email
    const { error } = await supabase.functions.invoke("send-quote-email", {
      body: JSON.stringify({
        quoteId,
        recipientEmail,
        subject,
        message,
        pdfBase64,
      })
    });

    if (error) {
      throw error;
    }
    
    toast({
      title: "Email enviado com sucesso",
      description: `O orçamento foi enviado para ${recipientEmail}`,
    });
    
    return true;
  } catch (error: any) {
    console.error("Error sending quote email:", error);
    toast({
      title: "Erro ao enviar email",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};

// Helper function to translate status to Portuguese
const getStatusInPortuguese = (status: string): string => {
  switch (status) {
    case 'draft': return 'Rascunho';
    case 'sent': return 'Enviado';
    case 'approved': return 'Aprovado';
    case 'rejected': return 'Rejeitado';
    case 'expired': return 'Expirado';
    default: return status;
  }
};
