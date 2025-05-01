
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';

interface UserInfoCardProps {
  userEmail: string | undefined;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ userEmail }) => {
  return (
    <Card className="shadow-md border-muted transition-all duration-200 hover:shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-900/40 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-muted-foreground" />
          Usuário
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{userEmail || 'Não disponível'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Acesso</span>
            <Badge className="bg-primary">Técnico</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;
