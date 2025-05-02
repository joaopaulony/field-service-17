
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchPostBySlug } from '@/services/blogService';
import BlogPostContent from '@/components/blog/BlogPostContent';
import SEOMetaTags from '@/components/blog/SEOMetaTags';
import { Loader2 } from 'lucide-react';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blogPost', slug],
    queryFn: () => slug ? fetchPostBySlug(slug) : Promise.resolve(null),
    enabled: !!slug,
  });

  // Redirecionar para página 404 se o post não for encontrado
  useEffect(() => {
    if (!isLoading && !post && !error) {
      navigate('/404', { replace: true });
    }
  }, [post, isLoading, navigate, error]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-red-600">Erro ao carregar o artigo</h1>
        <p className="mt-4">Não foi possível carregar o conteúdo deste artigo.</p>
      </div>
    );
  }

  return (
    <>
      <SEOMetaTags
        title={`${post.titulo} - Blog`}
        description={post.descricao || undefined}
        imageUrl={post.imagem_capa_url || undefined}
        canonicalUrl={`/blog/${post.slug}`}
        type="article"
        publishedTime={post.data_publicacao || undefined}
        tags={post.tags || undefined}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <BlogPostContent post={post} />
      </div>
    </>
  );
};

export default BlogPostPage;
