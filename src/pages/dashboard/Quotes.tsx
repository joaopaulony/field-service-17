
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getQuotes,
  getQuoteSummary,
  deleteQuote,
  generateQuotePDF,
} from "@/services/quoteService";
import QuoteCard from "@/components/quotes/QuoteCard";
import QuoteTable from "@/components/quotes/QuoteTable";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader2, BarChart3 } from "lucide-react";
import { Quote } from "@/types/quotes";

const Quotes: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Queries
  const {
    data: quotes = [],
    isLoading: isLoadingQuotes,
  } = useQuery({
    queryKey: ["quotes"],
    queryFn: getQuotes,
  });

  const {
    data: quoteSummary,
    isLoading: isLoadingSummary,
  } = useQuery({
    queryKey: ["quoteSummary"],
    queryFn: getQuoteSummary,
  });

  // State for dialogs
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  // Mutations
  const deleteQuoteMutation = useMutation({
    mutationFn: (id: string) => deleteQuote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      queryClient.invalidateQueries({ queryKey: ["quoteSummary"] });
      setIsDeleteDialogOpen(false);
      setSelectedQuote(null);
    },
  });

  // Handlers
  const handleEditQuote = (quote: Quote) => {
    navigate(`/dashboard/quotes/${quote.id}`);
  };

  const handleDeleteQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteQuote = () => {
    if (selectedQuote) {
      deleteQuoteMutation.mutate(selectedQuote.id);
    }
  };

  const handleGeneratePdf = async (quoteId: string) => {
    try {
      await generateQuotePDF(quoteId);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o PDF do orçamento.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orçamentos</h2>
          <p className="text-muted-foreground">
            Gerenciamento de orçamentos para clientes
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/dashboard/quotes/dashboard")}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button onClick={() => navigate("/dashboard/quotes/new")}>
            Novo Orçamento
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      {isLoadingSummary ? (
        <div className="flex items-center justify-center h-32 bg-muted rounded-md">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        quoteSummary && <QuoteCard summary={quoteSummary} />
      )}

      {/* Quotes Table */}
      {isLoadingQuotes ? (
        <div className="flex items-center justify-center h-64 bg-muted rounded-md">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <QuoteTable
          quotes={quotes}
          onEdit={handleEditQuote}
          onDelete={handleDeleteQuote}
          onGeneratePdf={handleGeneratePdf}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o orçamento para "
              {selectedQuote?.client_name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteQuote}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteQuoteMutation.isPending}
            >
              {deleteQuoteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Quotes;
