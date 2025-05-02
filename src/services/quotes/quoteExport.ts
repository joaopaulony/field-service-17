
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Company } from '../companyService';
import { getQuote } from './quoteCore';

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

/**
 * Generates a PDF for a quote
 */
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

/**
 * Downloads a PDF for a quote
 */
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

/**
 * Sends a quote by email
 */
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
