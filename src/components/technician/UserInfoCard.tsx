
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface UserInfoCardProps {
  userEmail: string | undefined;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ userEmail }) => {
  return (
    <Card className="shadow-sm border-muted">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/10 dark:to-purple-900/20">
        <CardTitle>Usuário</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{userEmail}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Acesso</span>
            <Badge className="bg-primary">Técnico</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;
