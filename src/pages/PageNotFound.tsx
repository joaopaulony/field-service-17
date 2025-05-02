
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PageNotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 bg-background">
      <div className="max-w-md text-center">
        <h2 className="text-9xl font-bold text-primary">404</h2>
        <h2 className="mt-8 text-3xl font-bold tracking-tight">Página não encontrada</h2>
        <p className="mt-4 text-muted-foreground">
          Desculpe, não conseguimos encontrar a página que você está procurando.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/">Voltar para a página inicial</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/blog">Ir para o blog</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
