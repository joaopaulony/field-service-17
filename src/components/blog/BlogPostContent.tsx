
import React from 'react';
import { BlogPost } from '@/types/blog';
import { formatDate } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from './Breadcrumb';
import CallToAction from './CallToAction';

interface BlogPostContentProps {
  post: BlogPost;
}

const BlogPostContent: React.FC<BlogPostContentProps> = ({ post }) => {
  return (
    <article className="max-w-4xl mx-auto">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-8">
        <BreadcrumbItem>
          <BreadcrumbLink to="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink to="/blog">Blog</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <span className="truncate max-w-[200px]">{post.titulo}</span>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <header className="mb-8">
        {/* Post Title */}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{post.titulo}</h1>
        
        {/* Post Meta */}
        <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-x-4 gap-y-2 mb-6">
          {post.data_publicacao && (
            <time dateTime={post.data_publicacao}>
              Publicado em {formatDate(post.data_publicacao)}
            </time>
          )}
        </div>
        
        {/* Featured Image */}
        {post.imagem_capa_url && (
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg mb-8">
            <img 
              src={post.imagem_capa_url} 
              alt={post.titulo}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Description */}
        {post.descricao && (
          <p className="text-xl text-muted-foreground italic mb-6">
            {post.descricao}
          </p>
        )}
      </header>
      
      {/* Post Content */}
      <main className="prose prose-slate max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: post.conteudo_html || '' }}
      />
      
      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <>
          <Separator className="my-8" />
          <div className="flex flex-wrap gap-2 mb-10">
            <span className="text-sm font-medium mr-2">Tags:</span>
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </>
      )}
      
      {/* Call to Action */}
      <CallToAction />
    </article>
  );
};

export default BlogPostContent;
