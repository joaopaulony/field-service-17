
import { supabase, uploadWorkOrderFile } from "@/integrations/supabase/client";
import { WorkOrderPhoto } from "@/types/workOrders";

// Serviços para fotos de ordens de serviço
export const addWorkOrderPhoto = async (
  workOrderId: string, 
  file: File, 
  description?: string
): Promise<WorkOrderPhoto> => {
  // Fazer upload do arquivo
  const photoUrl = await uploadWorkOrderFile(file, `photos/${workOrderId}`);
  
  if (!photoUrl) {
    throw new Error('Falha ao fazer upload da foto');
  }
  
  // Salvar referência no banco de dados
  const { data, error } = await supabase
    .from('work_order_photos')
    .insert({
      work_order_id: workOrderId,
      photo_url: photoUrl,
      description
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const deleteWorkOrderPhoto = async (id: string): Promise<void> => {
  // Buscar URL da foto
  const { data: photo } = await supabase
    .from('work_order_photos')
    .select('photo_url')
    .eq('id', id)
    .single();
    
  if (photo) {
    // Extrair caminho do arquivo da URL
    const fileUrl = new URL(photo.photo_url);
    const filePath = fileUrl.pathname.split('/').slice(2).join('/');
    
    // Excluir arquivo do storage
    const { error: storageError } = await supabase.storage
      .from('work_orders')
      .remove([filePath]);
      
    if (storageError) {
      console.error('Erro ao excluir arquivo do storage:', storageError);
    }
  }
  
  // Excluir referência do banco de dados
  const { error } = await supabase
    .from('work_order_photos')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};

// Serviço para assinatura
export const saveSignature = async (
  workOrderId: string, 
  signatureFile: File
): Promise<string> => {
  const signatureUrl = await uploadWorkOrderFile(signatureFile, `signatures/${workOrderId}`);
  
  if (!signatureUrl) {
    throw new Error('Falha ao fazer upload da assinatura');
  }
  
  // Atualizar a OS com a URL da assinatura
  const { error } = await supabase
    .from('work_orders')
    .update({
      signature_url: signatureUrl,
      status: 'completed',
      completion_date: new Date().toISOString()
    })
    .eq('id', workOrderId);
  
  if (error) throw error;
  return signatureUrl;
};
