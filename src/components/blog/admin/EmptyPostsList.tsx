
import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const EmptyPostsList: React.FC = () => {
  const navigate = useNavigate();
  
  return (
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
  );
};

export default EmptyPostsList;
