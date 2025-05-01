
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface UpdateCompanyDTO {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  contact_person?: string;
  logo_url?: string;
}

export interface Company {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  contact_person: string | null;
  logo_url: string | null;
  plan: string;
  created_at: string;
  updated_at: string;
}

export const getCompanyDetails = async (): Promise<Company | null> => {
  try {
    console.log("Fetching company details");
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      console.log("No authenticated user found");
      return null;
    }

    console.log("User ID:", user.user.id);
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("id", user.user.id)
      .single();

    if (error) {
      console.error("Error fetching company details:", error);
      return null;
    }

    console.log("Company details fetched:", data);
    return data as Company;
  } catch (error) {
    console.error("Error in getCompanyDetails:", error);
    return null;
  }
};

export const updateCompany = async (updates: UpdateCompanyDTO): Promise<boolean> => {
  try {
    console.log("Updating company with data:", updates);
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      console.error("No authenticated user found for update");
      toast({
        title: "Erro ao atualizar",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return false;
    }

    console.log("User ID for update:", user.user.id);
    const { error } = await supabase
      .from("companies")
      .update(updates)
      .eq("id", user.user.id);

    if (error) {
      console.error("Error updating company:", error);
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    console.log("Company updated successfully");
    toast({
      title: "Configurações atualizadas",
      description: "As configurações da empresa foram atualizadas com sucesso.",
    });
    return true;
  } catch (error: any) {
    console.error("Error in updateCompany:", error);
    toast({
      title: "Erro ao atualizar",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};

export const uploadCompanyLogo = async (file: File): Promise<string | null> => {
  try {
    console.log("Starting logo upload process");
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      console.error("No authenticated user found for logo upload");
      toast({
        title: "Erro ao fazer upload",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return null;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.user.id}_${Date.now()}.${fileExt}`;
    const filePath = `company_logos/${fileName}`;

    console.log("Uploading file to path:", filePath, "in bucket: logos");
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('logos')
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading logo:", uploadError);
      toast({
        title: "Erro ao fazer upload",
        description: uploadError.message,
        variant: "destructive",
      });
      return null;
    }

    console.log("Upload successful, data:", uploadData);
    const { data: publicUrl } = supabase.storage
      .from('logos')
      .getPublicUrl(filePath);

    console.log("Public URL generated:", publicUrl);
    return publicUrl.publicUrl;
  } catch (error: any) {
    console.error("Error in uploadCompanyLogo:", error);
    toast({
      title: "Erro ao fazer upload",
        description: error.message || "Erro desconhecido ao fazer upload",
      variant: "destructive",
    });
    return null;
  }
};
