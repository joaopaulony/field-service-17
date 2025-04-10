
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

interface TechnicianHeaderProps {
  activeOrders: number;
  completedOrders: number;
}

const TechnicianHeader: React.FC<TechnicianHeaderProps> = ({ activeOrders, completedOrders }) => {
  const { user } = useAuth();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="mt-4 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {user ? getInitials(user.email || "Técnico") : "TC"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-lg font-semibold">Olá, Técnico!</h1>
          <p className="text-sm text-muted-foreground">Técnico de Campo</p>
        </div>
      </div>
      
      <Card className="bg-muted">
        <CardContent className="p-3 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">Hoje</p>
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{activeOrders} OS em andamento</p>
            <p className="text-xs text-muted-foreground">{completedOrders} concluídas</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicianHeader;
