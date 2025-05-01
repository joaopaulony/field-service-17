
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

type QuickActionCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  linkTo: string;
  linkText: string;
  gradientFrom: string;
  gradientTo?: string;
  borderColor: string;
};

const QuickActionCard = ({ 
  title, 
  description, 
  icon: Icon, 
  linkTo, 
  linkText,
  gradientFrom,
  gradientTo = 'white',
  borderColor
}: QuickActionCardProps) => {
  return (
    <Card className={`shadow-sm bg-gradient-to-br from-${gradientFrom}-50 to-${gradientTo} border-${borderColor}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link to={linkTo}>{linkText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuickActionCard;
