
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { BlogPost } from '@/types/blog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import BlogPostActions from './BlogPostActions';

interface BlogPostsTableProps {
  posts: BlogPost[];
  isTogglingPublish: string | null;
  onPostTogglePublish: (post: BlogPost) => Promise<void>;
  onSelectPostToDelete: (post: BlogPost) => void;
}

const BlogPostsTable: React.FC<BlogPostsTableProps> = ({
  posts,
  isTogglingPublish,
  onPostTogglePublish,
  onSelectPostToDelete
}) => {
  return (
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
          {posts.map((post) => (
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
                  onCheckedChange={() => onPostTogglePublish(post)}
                  disabled={isTogglingPublish === post.id}
                />
              </TableCell>
              <TableCell className="text-right">
                <BlogPostActions 
                  post={post} 
                  onSelectPostToDelete={onSelectPostToDelete} 
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BlogPostsTable;
