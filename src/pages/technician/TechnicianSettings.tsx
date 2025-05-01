
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCompanyDetails } from '@/services/companyService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const TechnicianSettings = () => {
  const { user } = useAuth();
  
  const { data: company, isLoading } = useQuery({
    queryKey: ['companyDetails'],
    queryFn: getCompanyDetails,
  });

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container px-4 py-6 mx-auto max-w-md">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Configurações</h1>
      
      <div className="space-y-6">
        <Card className="shadow-sm border-muted overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-900/20">
            <CardTitle>Empresa</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-center gap-4 p-6">
            <Avatar className="w-20 h-20 border border-border">
              <AvatarImage src={company?.logo_url || ''} alt="Logo da empresa" />
              <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                {company ? getInitials(company.name) : 'FS'}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h2 className="text-xl font-medium">{company?.name}</h2>
              {company?.email && (
                <p className="text-sm text-muted-foreground mt-1">{company.email}</p>
              )}
              {company?.phone && (
                <p className="text-sm text-muted-foreground">{company.phone}</p>
              )}
              {company?.address && (
                <p className="text-sm text-muted-foreground">{company.address}, {company.city} - {company.state}</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-muted">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/10 dark:to-purple-900/20">
            <CardTitle>Usuário</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Acesso</span>
                <Badge className="bg-primary">Técnico</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
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
      </div>
    </div>
  );
};

export default TechnicianSettings;
