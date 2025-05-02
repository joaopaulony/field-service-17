
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { createPost } from '@/services/blogService';
import { hasUserRole } from '@/services/userRolesService';
import { BlogPostFormData } from '@/types/blog';
import BlogPostForm from '@/components/blog/admin/BlogPostForm';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const BlogNewPostPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ['isAdmin', user?.id],
    queryFn: () => user ? hasUserRole(user.id, 'admin') : Promise.resolve(false),
    enabled: !!user,
  });

  const handleSave = async (data: BlogPostFormData) => {
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      // Adiciona o ID do autor ao post
      await createPost({
        ...data,
        author_id: user.id,
      });
      navigate('/admin/blog');
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/admin/blog')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">Novo Post</h2>
        </div>
      </div>

      <BlogPostForm
        onSave={handleSave}
        isSubmitting={isSubmitting}
        submitButtonText="Criar Post"
      />
    </div>
  );
};

export default BlogNewPostPage;
