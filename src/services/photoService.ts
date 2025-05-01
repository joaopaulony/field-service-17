
import { supabase } from '@/integrations/supabase/client';

// Add a photo to a work order
export const addWorkOrderPhoto = async (workOrderId: string, file: File, description: string = '') => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Usuário não autenticado');

    // Create folder structure: {userId}/{workOrderId}/{timestamp}.{extension}
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${workOrderId}/${Date.now()}.${fileExt}`;
    
    // Upload the file to Supabase Storage
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('work_order_photos')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      throw new Error(`Erro ao fazer upload da foto: ${uploadError.message}`);
    }

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('work_order_photos')
      .getPublicUrl(fileName);

    // Add the photo information to the database
    const { error: dbError, data } = await supabase
      .from('work_order_photos')
      .insert({
        work_order_id: workOrderId,
        photo_url: publicUrl,
        description: description || null
      })
      .select()
      .single();

    if (dbError) {
      console.error('Error adding photo to database:', dbError);
      throw new Error(`Erro ao salvar informações da foto: ${dbError.message}`);
    }

    return data;
  } catch (error: any) {
    console.error('Error adding photo:', error);
    throw error;
  }
};

// Save signature for a work order
export const saveSignature = async (workOrderId: string, signatureFile: File) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Usuário não autenticado');
    
    // Create folder structure: {userId}/{workOrderId}_signature_{timestamp}.png
    const fileName = `${user.id}/${workOrderId}_signature_${Date.now()}.png`;
    
    // Upload the signature to Supabase Storage
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('signatures')
      .upload(fileName, signatureFile);

    if (uploadError) {
      console.error('Error uploading signature:', uploadError);
      throw new Error(`Erro ao fazer upload da assinatura: ${uploadError.message}`);
    }

    // Get the public URL for the uploaded signature
    const { data: { publicUrl } } = supabase.storage
      .from('signatures')
      .getPublicUrl(fileName);

    // Update the work order with the signature URL
    const { error: updateError, data } = await supabase
      .from('work_orders')
      .update({ signature_url: publicUrl })
      .eq('id', workOrderId)
      .select()
      .single();

    if (updateError) {
      console.error('Error saving signature URL:', updateError);
      throw new Error(`Erro ao salvar URL da assinatura: ${updateError.message}`);
    }

    return data;
  } catch (error: any) {
    console.error('Error saving signature:', error);
    throw error;
  }
};

// Delete a work order photo
export const deleteWorkOrderPhoto = async (photoId: string) => {
  try {
    // Get the photo details first to get the file URL
    const { data: photo, error: fetchError } = await supabase
      .from('work_order_photos')
      .select('*')
      .eq('id', photoId)
      .single();

    if (fetchError) {
      console.error('Error fetching photo:', fetchError);
      throw new Error(`Erro ao buscar foto: ${fetchError.message}`);
    }

    if (!photo) {
      throw new Error('Foto não encontrada');
    }

    // Delete from database
    const { error: deleteDbError } = await supabase
      .from('work_order_photos')
      .delete()
      .eq('id', photoId);

    if (deleteDbError) {
      console.error('Error deleting photo from database:', deleteDbError);
      throw new Error(`Erro ao excluir foto do banco de dados: ${deleteDbError.message}`);
    }

    // Extract file path from URL
    const url = new URL(photo.photo_url);
    const pathnameParts = url.pathname.split('/');
    const filePathIndex = pathnameParts.findIndex(part => part === 'work_order_photos') + 1;
    
    if (filePathIndex > 0 && filePathIndex < pathnameParts.length) {
      const filePath = pathnameParts.slice(filePathIndex).join('/');
      
      // Delete from storage
      const { error: deleteStorageError } = await supabase.storage
        .from('work_order_photos')
        .remove([filePath]);

      if (deleteStorageError) {
        console.warn('Error deleting file from storage:', deleteStorageError);
        // We'll still consider the operation successful if the DB record was deleted
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting photo:', error);
    throw error;
  }
};
