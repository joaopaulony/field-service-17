
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailQuoteRequest {
  quoteId: string;
  recipientEmail: string;
  subject?: string;
  message?: string;
  pdfBase64: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { quoteId, recipientEmail, subject, message, pdfBase64 } = await req.json() as EmailQuoteRequest;
    
    // Get authentication header to identify the user
    const authHeader = req.headers.get('Authorization') || '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader }
      },
    });
    
    // Get company info for the email
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    // Get company data
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("*")
      .eq("id", user.id)
      .single();
      
    if (companyError) {
      throw new Error("Dados da empresa não encontrados");
    }
    
    // Get quote data to update email_sent and email_sent_at
    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", quoteId)
      .single();
      
    if (quoteError) {
      throw new Error("Orçamento não encontrado");
    }
    
    // Format the PDF filename
    const fileName = `orcamento_${quoteId.substring(0, 8)}.pdf`;
    
    // Send the email with the PDF attachment
    const emailResponse = await resend.emails.send({
      from: company.email ? `${company.name} <onboarding@resend.dev>` : "Orçamento <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: subject || `Orçamento #${quoteId.substring(0, 8)}`,
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h1>Orçamento #${quoteId.substring(0, 8)}</h1>
          ${message ? `<p>${message}</p>` : ''}
          <p>Prezado(a) ${quote.client_name},</p>
          <p>
            Segue em anexo o orçamento solicitado. 
            ${quote.valid_until ? `Este orçamento é válido até ${new Date(quote.valid_until).toLocaleDateString('pt-BR')}.` : ''}
          </p>
          <p>Caso tenha alguma dúvida, não hesite em nos contatar.</p>
          <p>
            Atenciosamente,<br />
            ${company.name}<br />
            ${company.phone || ''}<br />
            ${company.email || ''}
          </p>
        </div>
      `,
      attachments: [
        {
          filename: fileName,
          content: pdfBase64,
        },
      ],
    });
    
    // Update the quote to mark as emailed
    await supabase
      .from("quotes")
      .update({ 
        email_sent: true,
        email_sent_at: new Date().toISOString()
      })
      .eq("id", quoteId);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending quote email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
