
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AppInfoCard: React.FC = () => {
  return (
    <Card className="shadow-sm border-muted">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/10 dark:to-gray-900/20">
        <CardTitle>Sobre o aplicativo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Versão</span>
          <span>1.0.0</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Desenvolvido por</span>
          <span>FieldService</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppInfoCard;
