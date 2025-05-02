
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbProps {
  children: React.ReactNode;
  className?: string;
}

export const Breadcrumb = ({ children, className }: BreadcrumbProps) => {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center space-x-1 text-sm', className)}>
      <ol className="flex items-center space-x-1">
        {children}
      </ol>
    </nav>
  );
};

interface BreadcrumbItemProps {
  children: React.ReactNode;
  isCurrentPage?: boolean;
}

export const BreadcrumbItem = ({ children, isCurrentPage }: BreadcrumbItemProps) => {
  return (
    <li className="flex items-center">
      <div className="flex items-center">
        {children}
      </div>
      {!isCurrentPage && (
        <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
      )}
    </li>
  );
};

interface BreadcrumbLinkProps {
  children: React.ReactNode;
  to: string;
}

export const BreadcrumbLink = ({ children, to }: BreadcrumbLinkProps) => {
  return (
    <Link
      to={to}
      className="text-muted-foreground hover:text-foreground transition-colors"
    >
      {children}
    </Link>
  );
};
