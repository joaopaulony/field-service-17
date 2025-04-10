
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { getCompanyPlan } from '@/services/planService';
import { PlanType } from '@/services/planService';

interface PlanInfoBadgeProps {
  showLabel?: boolean;
  className?: string;
}

const PlanInfoBadge: React.FC<PlanInfoBadgeProps> = ({ showLabel = true, className = '' }) => {
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

  if (isLoading) {
    return <Badge variant="outline" className={className}>Carregando...</Badge>;
  }

  const planDetails = {
    'free': { label: 'Gratuito', variant: 'outline' as const },
    'basic': { label: 'Básico', variant: 'default' as const },
    'professional': { label: 'Profissional', variant: 'secondary' as const },
    'enterprise': { label: 'Empresarial', variant: 'secondary' as const }
  }[plan];

  return (
    <Badge variant={planDetails.variant} className={className}>
      {showLabel ? `Plano: ${planDetails.label}` : planDetails.label}
    </Badge>
  );
};

export default PlanInfoBadge;
