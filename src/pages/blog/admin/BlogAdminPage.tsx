
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import BlogAdminList from '@/components/blog/admin/BlogAdminList';
import { hasUserRole } from '@/services/userRolesService';

const BlogAdminPage: React.FC = () => {
  const { user } = useAuth();
  
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ['isAdmin', user?.id],
    queryFn: () => user ? hasUserRole(user.id, 'admin') : Promise.resolve(false),
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
        <p className="mt-4">
          Você não possui permissões de administrador para acessar esta página.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <BlogAdminList />
    </div>
  );
};

export default BlogAdminPage;
