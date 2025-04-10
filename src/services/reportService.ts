
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { WorkOrder, WorkOrderPhoto } from '@/types/workOrders';

export const generateWorkOrderPDF = async (workOrder: WorkOrder): Promise<Blob> => {
  // Inicializa o documento PDF
  const doc = new jsPDF();
  
  // Configura fonte para suportar caracteres especiais
  doc.setFont('helvetica');
  
  // Adiciona logo ou cabeçalho
  doc.setFontSize(20);
  doc.text('Relatório de Ordem de Serviço', 105, 15, { align: 'center' });
  
  // ID e data da ordem
  doc.setFontSize(12);
  doc.text(`ID: ${workOrder.id}`, 14, 25);
  doc.text(`Data: ${new Date(workOrder.created_at).toLocaleDateString('pt-BR')}`, 14, 32);
  
  // Status
  doc.setFontSize(14);
  doc.text(`Status: ${translateStatus(workOrder.status)}`, 14, 40);
  
  // Informações principais
  doc.setFontSize(16);
  doc.text('Informações da Ordem de Serviço', 14, 50);
  
  // Tabela com informações
  autoTable(doc, {
    startY: 55,
    head: [['Campo', 'Valor']],
    body: [
      ['Título', workOrder.title],
      ['Descrição', workOrder.description || 'N/A'],
      ['Cliente', workOrder.client_name || 'N/A'],
      ['Localização', workOrder.location || 'N/A'],
      ['Técnico', workOrder.technician?.name || 'N/A'],
      ['Data de Agendamento', workOrder.scheduled_date ? new Date(workOrder.scheduled_date).toLocaleDateString('pt-BR') : 'N/A'],
      ['Data de Conclusão', workOrder.completion_date ? new Date(workOrder.completion_date).toLocaleDateString('pt-BR') : 'N/A'],
    ],
  });
  
  // Adiciona notas se existirem
  if (workOrder.notes) {
    const finalY = (doc as any).lastAutoTable.finalY || 120;
    doc.text('Notas:', 14, finalY + 10);
    
    // Texto com quebra automática de linha
    const splitNotes = doc.splitTextToSize(workOrder.notes, 180);
    doc.text(splitNotes, 14, finalY + 18);
  }
  
  // Se existem fotos, adiciona-as ao PDF
  if (workOrder.photos && workOrder.photos.length > 0) {
    // Nova página para fotos
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Fotos da Ordem de Serviço', 14, 15);
    
    // Coloca até 4 fotos por página
    await addPhotosToDocument(doc, workOrder.photos);
  }
  
  // Se existe assinatura, adiciona à última página
  if (workOrder.signature_url) {
    // Nova página para assinatura se necessário
    if (!workOrder.photos || workOrder.photos.length === 0) {
      doc.addPage();
    }
    
    const lastPage = doc.getNumberOfPages();
    doc.setPage(lastPage);
    
    const currentY = doc.internal.pageSize.height - 40;
    
    doc.setFontSize(12);
    doc.text('Assinatura do Cliente:', 14, currentY - 10);
    
    // Adiciona a imagem da assinatura
    await addImageToDocument(doc, workOrder.signature_url, 14, currentY - 8, 80, 30);
    
    // Adiciona linha para assinatura do técnico
    doc.text('Técnico: ' + (workOrder.technician?.name || ''), 14, currentY + 30);
  }
  
  // Adiciona informações de rodapé em todas as páginas
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Página ${i} de ${totalPages}`, 14, doc.internal.pageSize.height - 10);
    doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')}`, doc.internal.pageSize.width - 60, doc.internal.pageSize.height - 10);
  }
  
  // Retorna o PDF como Blob
  return doc.output('blob');
};

// Função auxiliar para traduzir status
const translateStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: 'Pendente',
    in_progress: 'Em Andamento',
    completed: 'Concluído',
    cancelled: 'Cancelado'
  };
  
  return statusMap[status] || status;
};

// Função para adicionar imagens ao documento
const addImageToDocument = (doc: jsPDF, url: string, x: number, y: number, width: number, height: number): Promise<void> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        doc.addImage(img, 'JPEG', x, y, width, height);
      } catch (error) {
        console.error('Erro ao adicionar imagem:', error);
      }
      resolve();
    };
    img.onerror = () => {
      console.error('Erro ao carregar imagem:', url);
      resolve();
    };
    img.src = url;
  });
};

// Função para adicionar fotos ao documento
const addPhotosToDocument = async (doc: jsPDF, photos: WorkOrderPhoto[]): Promise<void> => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  const photoWidth = (pageWidth - 40) / 2;
  const photoHeight = photoWidth * 0.75;
  const photoMargin = 12;
  
  let currentY = 25;
  let currentX = 14;
  
  for (let i = 0; i < photos.length; i++) {
    // Nova página a cada 4 fotos
    if (i > 0 && i % 4 === 0) {
      doc.addPage();
      currentY = 25;
    }
    
    // Nova linha a cada 2 fotos
    if (i % 2 === 0 && i % 4 !== 0) {
      currentY += photoHeight + photoMargin;
      currentX = 14;
    }
    
    // Adiciona a foto
    await addImageToDocument(doc, photos[i].photo_url, currentX, currentY, photoWidth, photoHeight);
    
    // Adiciona a descrição da foto (se existir)
    if (photos[i].description) {
      doc.setFontSize(8);
      const description = doc.splitTextToSize(photos[i].description, photoWidth);
      doc.text(description, currentX, currentY + photoHeight + 5, { maxWidth: photoWidth });
    }
    
    // Atualiza a posição X para a próxima foto
    currentX = pageWidth - photoWidth - 14;
  }
};
