
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PlanFeatureAlertProps {
  title: string;
  description: string;
  showUpgradeButton?: boolean;
}

const PlanFeatureAlert: React.FC<PlanFeatureAlertProps> = ({
  title,
  description,
  showUpgradeButton = true
}) => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex justify-between items-center">
        <span>{description}</span>
        {showUpgradeButton && (
          <Button variant="outline" size="sm" className="ml-2" asChild>
            <Link to="/dashboard/account/billing">Upgrade de Plano</Link>
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default PlanFeatureAlert;
