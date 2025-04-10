
import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { FileText, Clock, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { WorkOrder } from '@/types/workOrders';
import { generateWorkOrderPDF } from '@/services/reportService';
import { canExportPDF, showUpgradePlanAlert } from '@/services/planService';

interface GeneratePDFButtonProps {
  workOrder: WorkOrder;
  disabled?: boolean;
}

const GeneratePDFButton: React.FC<GeneratePDFButtonProps> = ({ workOrder, disabled }) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [canExport, setCanExport] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkExportPermission = async () => {
      try {
        const hasPermission = await canExportPDF();
        setCanExport(hasPermission);
      } catch (error) {
        console.error('Error checking PDF export permission:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkExportPermission();
  }, []);
  
  const generatePDFMutation = useMutation({
    mutationFn: async () => {
      try {
        // Check permission again right before generating
        const hasPermission = await canExportPDF();
        if (!hasPermission) {
          showUpgradePlanAlert('Exportação de PDF');
          throw new Error('Plano atual não permite exportação de PDF');
        }
        
        setIsGenerating(true);
        return await generateWorkOrderPDF(workOrder);
      } finally {
        setIsGenerating(false);
      }
    },
    onSuccess: (pdfBlob) => {
      // Cria um URL temporário para o PDF
      const url = URL.createObjectURL(pdfBlob);
      
      // Cria um link para download
      const link = document.createElement('a');
      link.href = url;
      link.download = `ordem-servico-${workOrder.id}.pdf`;
      
      // Adiciona o link ao documento e simula o clique
      document.body.appendChild(link);
      link.click();
      
      // Remove o link e libera o URL
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
      toast({
        title: "PDF gerado com sucesso",
        description: "O download do relatório foi iniciado.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao gerar PDF",
        description: error.message || "Ocorreu um erro ao gerar o relatório.",
        variant: "destructive"
      });
    }
  });
  
  const handleGeneratePDF = () => {
    if (!canExport) {
      showUpgradePlanAlert('Exportação de PDF');
      return;
    }
    generatePDFMutation.mutate();
  };
  
  if (isLoading) {
    return (
      <Button variant="outline" disabled className="gap-2">
        <Clock className="h-4 w-4 animate-spin" />
        Carregando...
      </Button>
    );
  }
  
  return (
    <Button
      onClick={handleGeneratePDF}
      disabled={disabled || isGenerating || generatePDFMutation.isPending}
      variant="outline"
      className="gap-2"
    >
      {isGenerating || generatePDFMutation.isPending ? (
        <>
          <Clock className="h-4 w-4 animate-spin" />
          Gerando PDF...
        </>
      ) : canExport ? (
        <>
          <FileText className="h-4 w-4" />
          Gerar PDF
        </>
      ) : (
        <>
          <Lock className="h-4 w-4" />
          Gerar PDF (Upgrade)
        </>
      )}
    </Button>
  );
};

export default GeneratePDFButton;
