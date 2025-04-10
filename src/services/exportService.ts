
import * as XLSX from 'xlsx';
import { WorkOrder } from '@/types/workOrders';

export type ExportFormat = 'xlsx' | 'csv';
export type ExportDetailLevel = 'summary' | 'detailed';

interface ExportOptions {
  format: ExportFormat;
  detailLevel: ExportDetailLevel;
  fileName?: string;
}

/**
 * Exporta as ordens de serviço para Excel ou CSV
 */
export const exportWorkOrders = (
  workOrders: WorkOrder[], 
  options: ExportOptions
) => {
  const { format, detailLevel, fileName = 'ordens-servico' } = options;
  
  // Prepara os dados de acordo com o nível de detalhe
  const data = detailLevel === 'summary' 
    ? prepareWorkOrderSummary(workOrders)
    : prepareWorkOrderDetailed(workOrders);
  
  // Cria uma planilha com os dados
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Cria um workbook e adiciona a planilha
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Ordens de Serviço');
  
  // Define o tipo de arquivo e extensão
  const fileExtension = format === 'xlsx' ? '.xlsx' : '.csv';
  const fullFileName = `${fileName}${fileExtension}`;
  
  // Exporta o arquivo
  if (format === 'xlsx') {
    XLSX.writeFile(workbook, fullFileName);
  } else {
    // Para CSV, precisamos converter o workbook para string
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    downloadCSV(csvContent, fullFileName);
  }
  
  return true;
};

/**
 * Prepara um resumo das ordens de serviço (menos campos)
 */
const prepareWorkOrderSummary = (workOrders: WorkOrder[]) => {
  return workOrders.map(order => ({
    'ID': order.id.slice(0, 8),
    'Título': order.title,
    'Cliente': order.client_name || '-',
    'Local': order.location || '-',
    'Técnico': order.technician?.name || '-',
    'Status': translateStatus(order.status),
    'Data de Criação': formatDate(order.created_at),
    'Data Agendada': order.scheduled_date ? formatDate(order.scheduled_date) : '-'
  }));
};

/**
 * Prepara dados detalhados das ordens de serviço (mais campos)
 */
const prepareWorkOrderDetailed = (workOrders: WorkOrder[]) => {
  return workOrders.map(order => ({
    'ID': order.id,
    'Título': order.title,
    'Descrição': order.description || '-',
    'Cliente': order.client_name || '-',
    'Local': order.location || '-',
    'Técnico ID': order.technician_id || '-',
    'Técnico': order.technician?.name || '-',
    'Status': translateStatus(order.status),
    'Data de Criação': formatDate(order.created_at),
    'Data de Atualização': formatDate(order.updated_at),
    'Data Agendada': order.scheduled_date ? formatDate(order.scheduled_date) : '-',
    'Data de Conclusão': order.completion_date ? formatDate(order.completion_date) : '-',
    'Notas': order.notes || '-',
    'Assinatura': order.signature_url ? 'Sim' : 'Não',
    'Número de Fotos': order.photos?.length || 0
  }));
};

/**
 * Traduz o status para português
 */
const translateStatus = (status: string): string => {
  switch (status) {
    case 'pending': return 'Pendente';
    case 'in_progress': return 'Em Andamento';
    case 'completed': return 'Concluído';
    default: return status;
  }
};

/**
 * Formata a data para o formato brasileiro
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

/**
 * Função auxiliar para download de CSV
 */
const downloadCSV = (csvContent: string, fileName: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  // Cria um URL para o blob
  const url = URL.createObjectURL(blob);
  
  // Configura o link de download
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  
  // Adiciona o link ao documento, clica nele e remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
