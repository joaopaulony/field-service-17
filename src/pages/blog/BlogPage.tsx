
import React from 'react';
import { Link } from 'react-router-dom';
import BlogPostList from '@/components/blog/BlogPostList';
import { Button } from '@/components/ui/button';
import SEOMetaTags from '@/components/blog/SEOMetaTags';

const BlogPage: React.FC = () => {
  return (
    <>
      <SEOMetaTags
        title="Blog - Artigos sobre Manutenção e Serviços Técnicos"
        description="Confira nossos artigos e dicas sobre manutenção, reparos e serviços técnicos. Mantenha-se informado com nosso conteúdo especializado."
        canonicalUrl="/blog"
      />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Artigos, dicas e novidades sobre manutenção, reparos e serviços técnicos para manter seu negócio funcionando perfeitamente.
          </p>
        </div>

        {/* Chamada para ação acima do conteúdo principal */}
        <div className="bg-muted/40 border rounded-lg p-6 mb-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Precisa de suporte técnico de qualidade?
            </h2>
            <p className="text-muted-foreground">
              Conte com nossa equipe de profissionais para resolver seu problema.
            </p>
          </div>
          <Button asChild>
            <Link to="/register">Começar agora</Link>
          </Button>
        </div>

        {/* Lista de Posts */}
        <BlogPostList />
      </div>
    </>
  );
};

export default BlogPage;
