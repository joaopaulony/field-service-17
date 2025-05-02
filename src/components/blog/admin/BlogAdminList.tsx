
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPosts, deletePost, publishPost, unpublishPost } from '@/services/blogService';
import { BlogPost } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus } from 'lucide-react';
import BlogPostsTable from './BlogPostsTable';
import EmptyPostsList from './EmptyPostsList';
import DeletePostDialog from './DeletePostDialog';
import { AlertDialog } from '@/components/ui/alert-dialog';

const BlogAdminList: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingPublish, setIsTogglingPublish] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: () => fetchAllPosts(),
  });

  const handlePublishToggle = async (post: BlogPost) => {
    try {
      setIsTogglingPublish(post.id);
      if (post.publicado) {
        await unpublishPost(post.id);
        toast({
          description: 'Post despublicado com sucesso.',
        });
      } else {
        await publishPost(post.id);
        toast({
          description: 'Post publicado com sucesso.',
        });
      }
      refetch();
    } catch (error) {
      console.error('Erro ao alterar status de publicação:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível alterar o status do post.',
      });
    } finally {
      setIsTogglingPublish(null);
    }
  };

  const handleSelectPostToDelete = (post: BlogPost) => {
    setPostToDelete(post);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;

    try {
      setIsDeleting(true);
      await deletePost(postToDelete.id);
      toast({
        description: 'Post excluído com sucesso.',
      });
      refetch();
    } catch (error) {
      console.error('Erro ao excluir post:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível excluir o post.',
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Erro ao carregar posts. Por favor, tente novamente.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Posts do Blog</h2>
        <Button onClick={() => navigate('/admin/blog/novo')} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Novo Post
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {data && data.posts.length === 0 ? (
            <EmptyPostsList />
          ) : (
            <BlogPostsTable
              posts={data?.posts || []}
              isTogglingPublish={isTogglingPublish}
              onPostTogglePublish={handlePublishToggle}
              onSelectPostToDelete={handleSelectPostToDelete}
            />
          )}
        </>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={handleCloseDeleteDialog}>
        <DeletePostDialog
          post={postToDelete}
          isOpen={isDeleteDialogOpen}
          isDeleting={isDeleting}
          onOpenChange={handleCloseDeleteDialog}
          onConfirm={handleDeleteConfirm}
        />
      </AlertDialog>
    </>
  );
};

export default BlogAdminList;
