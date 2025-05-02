
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCompanyDetails } from '@/services/companyService';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const getInitials = (name: string) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

export const CompanyDisplay: React.FC = () => {
  const { data: company, isLoading } = useQuery({
    queryKey: ["company"],
    queryFn: getCompanyDetails,
  });

  if (isLoading) {
    return <Skeleton className="h-10 w-44" />;
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 border border-border/40 rounded-md bg-background hover:bg-muted/30 transition-colors">
      <Avatar className="h-7 w-7 border border-border/30">
        <AvatarImage src={company?.logo_url || ""} />
        <AvatarFallback className="bg-muted text-muted-foreground font-medium">
          {getInitials(company?.name || '?')}
        </AvatarFallback>
      </Avatar>
      <span className="font-medium truncate max-w-[160px] text-foreground">
        {company?.name || "Empresa"}
      </span>
    </div>
  );
};
