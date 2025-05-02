
import React from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import QuoteFormComponent from "@/components/quotes/QuoteForm";
import { Button } from "@/components/ui/button";
import { createQuote, addQuoteItem } from "@/services/quoteService";
import { CreateQuoteDTO } from "@/types/quotes";

const QuoteForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mutation for creating a quote
  const createQuoteMutation = useMutation({
    mutationFn: async (data: { quote: CreateQuoteDTO, items: any[] }) => {
      const { quote, items } = data;
      
      // Create the quote first
      const newQuote = await createQuote(quote);
      
      if (!newQuote) {
        throw new Error("Não foi possível criar o orçamento");
      }

      // Add items to the quote
      if (items.length > 0) {
        for (const item of items) {
          await addQuoteItem({
            quote_id: newQuote.id,
            inventory_item_id: item.inventory_item_id || undefined,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            discount_percentage: item.discount_percentage
          });
        }
      }

      return newQuote;
    },
    onSuccess: () => {
      toast({
        title: "Orçamento criado",
        description: "O orçamento foi criado com sucesso",
      });
      navigate("/dashboard/quotes");
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar orçamento",
        description: error.message || "Ocorreu um erro ao criar o orçamento",
        variant: "destructive",
      });
    },
  });

  const handleFormSubmit = (quoteData: any, items: any[]) => {
    // Create quote DTO
    const quoteDTO: CreateQuoteDTO = {
      company_id: "", // This will be populated by the service
      client_name: quoteData.client_name,
      client_email: quoteData.client_email || undefined,
      client_phone: quoteData.client_phone || undefined,
      address: quoteData.address || undefined,
      valid_until: quoteData.valid_until ? quoteData.valid_until.toISOString() : undefined,
      notes: quoteData.notes || undefined,
      status: quoteData.status
    };

    createQuoteMutation.mutate({ quote: quoteDTO, items });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate("/dashboard/quotes")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Novo Orçamento</h2>
        </div>
      </div>
      
      <QuoteFormComponent
        onSubmit={handleFormSubmit}
        isSubmitting={createQuoteMutation.isPending}
      />
    </div>
  );
};

export default QuoteForm;
