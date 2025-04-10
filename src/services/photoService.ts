
import { supabase } from '@/integrations/supabase/client';

// Add a photo to a work order
export const addWorkOrderPhoto = async (workOrderId: string, file: File, description: string) => {
  try {
    // Upload the file to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${workOrderId}/${Date.now()}.${fileExt}`;
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('work-order-photos')
      .upload(fileName, file);

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('work-order-photos')
      .getPublicUrl(fileName);

    // Add the photo information to the database
    const { error: dbError, data } = await supabase
      .from('work_order_photos')
      .insert({
        work_order_id: workOrderId,
        url: publicUrl,
        description: description || null
      })
      .select()
      .single();

    if (dbError) {
      throw dbError;
    }

    return data;
  } catch (error) {
    console.error('Error adding photo:', error);
    throw error;
  }
};

// Save signature for a work order
export const saveSignature = async (workOrderId: string, signatureFile: File) => {
  try {
    // Upload the signature to Supabase Storage
    const fileName = `signatures/${workOrderId}_${Date.now()}.png`;
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('work-order-signatures')
      .upload(fileName, signatureFile);

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL for the uploaded signature
    const { data: { publicUrl } } = supabase.storage
      .from('work-order-signatures')
      .getPublicUrl(fileName);

    // Update the work order with the signature URL
    const { error: updateError, data } = await supabase
      .from('work_orders')
      .update({ signature_url: publicUrl })
      .eq('id', workOrderId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return data;
  } catch (error) {
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
      throw fetchError;
    }

    // Delete from database
    const { error: deleteDbError } = await supabase
      .from('work_order_photos')
      .delete()
      .eq('id', photoId);

    if (deleteDbError) {
      throw deleteDbError;
    }

    // Extract file path from URL
    // This assumes the URL format from Supabase storage
    const urlParts = photo.url.split('/');
    const bucketName = 'work-order-photos';
    const filePath = urlParts.slice(urlParts.indexOf(bucketName) + 1).join('/');

    // Delete from storage
    const { error: deleteStorageError } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (deleteStorageError) {
      console.warn('Error deleting file from storage:', deleteStorageError);
      // We'll still consider the operation successful if the DB record was deleted
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw error;
  }
};
