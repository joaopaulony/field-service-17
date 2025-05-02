
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const CallToAction: React.FC = () => {
  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader className="pb-3">
        <h3 className="text-xl font-bold">Precisa de serviços de manutenção?</h3>
        <CardDescription>
          Oferecemos soluções profissionais para todas as suas necessidades.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          Nossa equipe de técnicos especializados está pronta para atender suas demandas com 
          eficiência e qualidade. Desde reparos simples até projetos complexos, 
          temos a experiência necessária para entregar resultados excelentes.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link to="/register">
              Criar Conta Gratuita
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/dashboard">
              Conhecer Nossos Serviços
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CallToAction;
