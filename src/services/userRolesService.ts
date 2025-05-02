
import { supabase } from '@/integrations/supabase/client';

// Verificar se um usuário tem uma função específica
export const hasUserRole = async (userId: string, role: 'admin' | 'user'): Promise<boolean> => {
  const { data, error } = await supabase.rpc('has_role', {
    _user_id: userId,
    _role: role
  });

  if (error) {
    console.error('Erro ao verificar função do usuário:', error);
    return false;
  }

  return data || false;
};

// Adicionar uma função a um usuário
export const addUserRole = async (userId: string, role: 'admin' | 'user'): Promise<boolean> => {
  const { error } = await supabase
    .from('user_roles')
    .insert([
      { user_id: userId, role }
    ]);

  if (error) {
    // Se o erro for de duplicação, não é realmente um problema
    if (error.code === '23505') {  // Código de violação de unicidade
      return true;
    }
    console.error('Erro ao adicionar função ao usuário:', error);
    return false;
  }

  return true;
};

// Remover uma função de um usuário
export const removeUserRole = async (userId: string, role: 'admin' | 'user'): Promise<boolean> => {
  const { error } = await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', userId)
    .eq('role', role);

  if (error) {
    console.error('Erro ao remover função do usuário:', error);
    return false;
  }

  return true;
};

// Obter todas as funções de um usuário
export const getUserRoles = async (userId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId);

  if (error) {
    console.error('Erro ao obter funções do usuário:', error);
    return [];
  }

  return data.map(item => item.role);
};
