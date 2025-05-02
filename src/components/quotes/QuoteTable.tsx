
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Quote } from '@/types/quotes';
import { Edit, MoreHorizontal, Plus, Trash2, FileText, Clock, User, Calendar, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import QuoteEmailDialog from './QuoteEmailDialog';
import { downloadQuotePDF, sendQuoteByEmail } from '@/services/quoteService';

interface QuoteTableProps {
  quotes: Quote[];
  onEdit: (quote: Quote) => void;
  onDelete: (quote: Quote) => void;
  onGeneratePdf: (quoteId: string) => void;
}

const QuoteTable: React.FC<QuoteTableProps> = ({ 
  quotes, 
  onEdit, 
  onDelete,
  onGeneratePdf
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [selectedQuoteForEmail, setSelectedQuoteForEmail] = useState<Quote | null>(null);
  
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

  const handleDownloadPDF = async (quoteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await downloadQuotePDF(quoteId);
  };

  const handleOpenEmailDialog = (quote: Quote, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedQuoteForEmail(quote);
    setIsEmailDialogOpen(true);
  };

  const handleSendEmail = async (recipientEmail: string, subject?: string, message?: string) => {
    if (selectedQuoteForEmail) {
      await sendQuoteByEmail(
        selectedQuoteForEmail.id, 
        recipientEmail || selectedQuoteForEmail.client_email || "",
        subject,
        message
      );
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <div className="flex items-center justify-between p-4">
          <Input
            placeholder="Buscar por cliente ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button 
            size="sm" 
            onClick={() => navigate('/dashboard/quotes/new')}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Novo Orçamento
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Valor Total</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum orçamento encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredQuotes.map((quote) => (
                <TableRow key={quote.id} className="cursor-pointer" onClick={() => onEdit(quote)}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        {quote.client_name}
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">
                        #{quote.id.substring(0, 8)}
                      </span>
                      {quote.email_sent && (
                        <span className="text-xs text-blue-500 flex items-center gap-1 mt-1">
                          <Mail className="h-3 w-3" /> Email enviado
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quote.total_amount)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      {format(new Date(quote.created_at), 'dd/MM/yyyy')}
                    </div>
                  </TableCell>
                  <TableCell>
                    {quote.valid_until ? (
                      <div className="flex items-center text-sm">
                        <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                        {format(new Date(quote.valid_until), 'dd/MM/yyyy')}
                      </div>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(quote.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem onClick={() => onEdit(quote)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => handleDownloadPDF(quote.id, e)}>
                          <FileText className="mr-2 h-4 w-4" />
                          <span>Baixar PDF</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => handleOpenEmailDialog(quote, e)}>
                          <Mail className="mr-2 h-4 w-4" />
                          <span>Enviar por Email</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onDelete(quote)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Excluir</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedQuoteForEmail && (
        <QuoteEmailDialog
          isOpen={isEmailDialogOpen}
          onClose={() => setIsEmailDialogOpen(false)}
          onSendEmail={handleSendEmail}
          defaultEmail={selectedQuoteForEmail.client_email || ""}
          quoteId={selectedQuoteForEmail.id}
        />
      )}
    </>
  );
};

export default QuoteTable;
