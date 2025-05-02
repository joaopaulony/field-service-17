
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { isUserAdmin, fetchPostById, updatePost } from '@/services/blogService';
import { BlogPostFormData } from '@/types/blog';
import BlogPostForm from '@/components/blog/admin/BlogPostForm';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BlogEditPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const { data: isAdmin, isLoading: isCheckingAdmin } = useQuery({
    queryKey: ['isAdmin', user?.id],
    queryFn: () => user ? isUserAdmin(user.id) : Promise.resolve(false),
    enabled: !!user,
  });

  const { 
    data: post, 
    isLoading: isLoadingPost,
    error 
  } = useQuery({
    queryKey: ['blogPost', id],
    queryFn: () => id ? fetchPostById(id) : Promise.resolve(null),
    enabled: !!id && !!isAdmin,
  });

  const handleSave = async (data: BlogPostFormData) => {
    if (!id) return;
    
    try {
      setIsSubmitting(true);
      await updatePost(id, data);
      toast({
        title: 'Post atualizado',
        description: 'As alterações foram salvas com sucesso.',
      });
      navigate('/admin/blog');
    } catch (error) {
      console.error('Erro ao atualizar post:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar as alterações.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isCheckingAdmin || isLoadingPost;

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

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-red-600">Post não encontrado</h1>
        <p className="mt-4">O post que você está procurando não existe ou foi removido.</p>
        <Button className="mt-4" onClick={() => navigate('/admin/blog')}>
          Voltar para a lista
        </Button>
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
          <h2 className="text-2xl font-bold tracking-tight">Editar Post</h2>
        </div>
      </div>

      <BlogPostForm
        post={post}
        onSave={handleSave}
        isSubmitting={isSubmitting}
        submitButtonText="Atualizar Post"
      />
    </div>
  );
};

export default BlogEditPostPage;
