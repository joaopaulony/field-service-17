import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQuotes, generateQuotePDF } from '@/services/quoteService';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Banknote, Search, Calendar, FileText, User } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const TechnicianQuotes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: quotes = [], isLoading } = useQuery({
    queryKey: ['quotes'],
    queryFn: getQuotes,
  });
  
  const filteredQuotes = quotes.filter(quote => 
    quote.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Rascunho</Badge>;
      case 'sent':
        return <Badge variant="secondary">Enviado</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-600">Aprovado</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejeitado</Badge>;
      case 'expired':
        return <Badge variant="outline" className="text-amber-600 border-amber-600">Expirado</Badge>;
      default:
        return <Badge>{status}</Badge>;
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
    <div className="mobile-container space-y-4">
      <h1 className="text-2xl font-bold mb-4">Orçamentos</h1>
      
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por cliente ou ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : filteredQuotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            Nenhum orçamento encontrado.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQuotes.map((quote) => (
            <Card key={quote.id} className="overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg flex justify-between items-start">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    <span>{quote.client_name}</span>
                  </div>
                  {getStatusBadge(quote.status)}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  ID: {quote.id.substring(0, 8)}
                </p>
              </CardHeader>
              <CardContent className="p-4 pt-2 pb-2">
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="col-span-2">
                    <p className="text-muted-foreground flex items-center">
                      <Banknote className="h-4 w-4 mr-1" /> Valor Total:
                    </p>
                    <p className="font-semibold">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quote.total_amount)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground flex items-center">
                      <Calendar className="h-4 w-4 mr-1" /> Criado em:
                    </p>
                    <p>{format(new Date(quote.created_at), 'dd/MM/yyyy')}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground">Validade:</p>
                    <p>
                      {quote.valid_until 
                        ? format(new Date(quote.valid_until), 'dd/MM/yyyy')
                        : "—"
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-3 flex justify-end bg-muted/50">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  onClick={() => handleGeneratePdf(quote.id)}
                >
                  <FileText className="h-4 w-4" />
                  PDF
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TechnicianQuotes;
