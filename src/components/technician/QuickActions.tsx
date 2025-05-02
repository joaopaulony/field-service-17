
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Camera, CheckCircle2, AlertCircle, Clipboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCompanyPlan, PLAN_LIMITS } from '@/services/planService';
import { PlanType } from '@/services/planService';

const QuickActions: React.FC = () => {
  const [plan, setPlan] = useState<PlanType>('free');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const companyPlan = await getCompanyPlan();
        setPlan(companyPlan);
      } catch (error) {
        console.error('Error fetching plan:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlan();
  }, []);

  const renderPlanBadge = () => {
    if (isLoading) return null;
    
    const planLabel = {
      'free': 'Gratuito',
      'basic': 'Básico',
      'professional': 'Profissional',
      'enterprise': 'Empresarial'
    }[plan];
    
    return (
      <div className="mb-3 flex items-center">
        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center">
          <AlertCircle className="h-3 w-3 mr-1" />
          Plano {planLabel}
        </span>
      </div>
    );
  };

  return (
    <div className="mt-8 mb-4">
      <h2 className="text-lg font-semibold mb-1">Ações Rápidas</h2>
      {renderPlanBadge()}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-20 flex-col" asChild>
          <Link to="/technician/work-orders">
            <Clipboard className="h-6 w-6 mb-1" />
            <span>Ordens de Serviço</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-20 flex-col" asChild>
          <Link to="/technician/scan">
            <Camera className="h-6 w-6 mb-1" />
            <span>Escanear QR</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-20 flex-col" asChild>
          <Link to="/technician/history">
            <CheckCircle2 className="h-6 w-6 mb-1" />
            <span>Histórico</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;
