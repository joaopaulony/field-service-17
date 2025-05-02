
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BlogPost } from '@/types/blog';

interface BlogPostCardProps {
  post: Pick<BlogPost, 'titulo' | 'slug' | 'descricao' | 'imagem_capa_url' | 'tags' | 'data_publicacao'>;
  className?: string;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, className }) => {
  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow ${className || ''}`}>
      <Link to={`/blog/${post.slug}`}>
        {post.imagem_capa_url && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <img 
              src={post.imagem_capa_url} 
              alt={post.titulo}
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
            />
          </div>
        )}
      </Link>
      <CardHeader className="pt-4 pb-0">
        <Link to={`/blog/${post.slug}`}>
          <CardTitle className="text-xl hover:text-primary transition-colors">{post.titulo}</CardTitle>
        </Link>
        {post.data_publicacao && (
          <CardDescription className="text-sm text-gray-500">
            Publicado {formatDistanceToNow(new Date(post.data_publicacao), { addSuffix: true, locale: ptBR })}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="py-3">
        {post.descricao && <p className="text-muted-foreground line-clamp-2">{post.descricao}</p>}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 pt-0">
        {post.tags && post.tags.slice(0, 3).map((tag, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  );
};

export default BlogPostCard;
