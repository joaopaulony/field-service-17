
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const DashboardHeader = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo de volta! Aqui está um resumo das suas atividades.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button variant="outline" asChild>
          <Link to="/dashboard/work-orders">Ver Ordens de Serviço</Link>
        </Button>
        <Button asChild>
          <Link to="/dashboard/work-orders/new">Nova Ordem de Serviço</Link>
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
