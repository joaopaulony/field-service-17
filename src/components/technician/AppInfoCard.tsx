
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

const AppInfoCard: React.FC = () => {
  return (
    <Card className="shadow-md border-muted transition-all duration-200 hover:shadow-lg">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-900/40 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-muted-foreground" />
          Sobre o aplicativo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Versão</span>
          <span className="font-medium">1.0.0</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Desenvolvido por</span>
          <span className="font-medium">FieldService</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppInfoCard;
