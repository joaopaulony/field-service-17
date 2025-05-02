
import React from 'react';
import { BlogPost } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BlogPostActionsProps {
  post: BlogPost;
  onSelectPostToDelete: (post: BlogPost) => void;
}

const BlogPostActions: React.FC<BlogPostActionsProps> = ({ 
  post, 
  onSelectPostToDelete 
}) => {
  const navigate = useNavigate();

  return (
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
          onClick={() => onSelectPostToDelete(post)}
          title="Excluir"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
    </div>
  );
};

export default BlogPostActions;
