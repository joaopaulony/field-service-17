
import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const QuickActions: React.FC = () => {
  return (
    <div className="mt-8 mb-4">
      <h2 className="text-lg font-semibold mb-3">Ações Rápidas</h2>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-20 flex-col" asChild>
          <Link to="/tech/scan">
            <Camera className="h-6 w-6 mb-1" />
            <span>Escanear QR</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-20 flex-col" asChild>
          <Link to="/tech/history">
            <CheckCircle2 className="h-6 w-6 mb-1" />
            <span>Histórico</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;
