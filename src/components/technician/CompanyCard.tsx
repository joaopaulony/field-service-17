
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CompanyCardProps {
  company: {
    name: string;
    logo_url?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
  } | null;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
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
  );
};

export default CompanyCard;
