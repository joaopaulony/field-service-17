
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPublishedPosts, fetchAllTags } from '@/services/blogService';
import BlogPostCard from './BlogPostCard';
import { useSearchParams } from 'react-router-dom';
import { Pagination } from '../ui/pagination';
import { Badge } from '../ui/badge';

const BlogPostList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = searchParams.get('page');
  const tagParam = searchParams.get('tag');
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const perPage = 9;

  // Busca posts publicados
  const { data, isLoading, error } = useQuery({
    queryKey: ['publishedPosts', page, tagParam],
    queryFn: () => fetchPublishedPosts({ page, per_page: perPage, tag: tagParam || undefined }),
  });

  // Busca todas as tags para o filtro
  const { data: tagsData } = useQuery({
    queryKey: ['blogTags'],
    queryFn: () => fetchAllTags(),
  });

  // Função para mudar a página atual
  const handlePageChange = (newPage: number) => {
    setSearchParams(prev => {
      prev.set('page', newPage.toString());
      return prev;
    });
  };

  // Função para filtrar por tag
  const handleTagClick = (tag: string) => {
    setSearchParams(prev => {
      if (prev.get('tag') === tag) {
        prev.delete('tag');
      } else {
        prev.set('tag', tag);
      }
      prev.delete('page'); // Reset para página 1
      return prev;
    });
  };

  // Função para limpar todos os filtros
  const clearFilters = () => {
    setSearchParams({});
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Erro ao carregar artigos. Por favor, tente novamente.</div>;
  }

  const totalPages = data?.count ? Math.ceil(data.count / perPage) : 0;

  return (
    <div className="space-y-6">
      {/* Filtro de tags */}
      {tagsData && tagsData.length > 0 && (
        <div className="mb-6 space-y-2">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium">Filtrar por:</span>
            {tagsData.map((tag, index) => (
              <Badge 
                key={index}
                variant={tagParam === tag ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </Badge>
            ))}
            {tagParam && (
              <button 
                onClick={clearFilters}
                className="text-sm text-primary hover:underline"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>
      )}

      {/* Resultados */}
      {data?.posts.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">Nenhum artigo encontrado</h3>
          <p className="text-muted-foreground mt-2">
            {tagParam ? 
              `Não encontramos artigos com a tag "${tagParam}".` : 
              'Não há artigos publicados no momento.'}
          </p>
          {tagParam && (
            <button 
              onClick={clearFilters} 
              className="mt-4 text-primary hover:underline"
            >
              Ver todos os artigos
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <Pagination 
                currentPage={page} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlogPostList;
