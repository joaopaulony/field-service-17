
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { fetchAllPosts, deletePost, publishPost, unpublishPost } from '@/services/blogService';
import { BlogPost } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Eye, Edit, Trash2, Plus, FileText, Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

const BlogAdminList: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [postToDelete, setPostToDelete] = React.useState<BlogPost | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isTogglingPublish, setIsTogglingPublish] = React.useState<string | null>(null);

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

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;

    try {
      setIsDeleting(true);
      await deletePost(postToDelete.id);
      toast({
        description: 'Post excluído com sucesso.',
      });
      refetch();
      setPostToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir post:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível excluir o post.',
      });
    } finally {
      setIsDeleting(false);
    }
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
            <div className="text-center py-16 border rounded-lg">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">Nenhum post encontrado</h3>
              <p className="text-muted-foreground mt-2 mb-6">
                Comece a criar conteúdo para o seu blog.
              </p>
              <Button onClick={() => navigate('/admin/blog/novo')}>
                Criar Primeiro Post
              </Button>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Última atualização</TableHead>
                    <TableHead>Publicado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span className="truncate max-w-[250px]">{post.titulo}</span>
                          <span className="text-xs text-muted-foreground truncate max-w-[250px]">
                            /blog/{post.slug}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={post.publicado ? "default" : "outline"}>
                          {post.publicado ? "Publicado" : "Rascunho"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDistanceToNow(new Date(post.updated_at), { addSuffix: true, locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={post.publicado || false}
                          onCheckedChange={() => handlePublishToggle(post)}
                          disabled={isTogglingPublish === post.id}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate(`/blog/${post.slug}`)}
                            title="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate(`/admin/blog/editar/${post.id}`)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="border-red-200 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => setPostToDelete(post)}
                              title="Excluir"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}

      {/* Diálogo de confirmação para exclusão */}
      <AlertDialog open={!!postToDelete} onOpenChange={(open) => !open && setPostToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o post{' '}
              <strong>"{postToDelete?.titulo}"</strong> e todos os seus dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Excluindo...</span>
                </>
              ) : (
                "Excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BlogAdminList;
