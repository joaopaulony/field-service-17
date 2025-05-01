
import React from 'react';
import { Clipboard, Users, BarChart3 } from 'lucide-react';
import QuickActionCard from './QuickActionCard';

const QuickActionGrid = () => {
  const quickActions = [
    {
      title: 'Ordens de Serviço',
      description: 'Gerencie todas as suas ordens de serviço em um só lugar.',
      icon: Clipboard,
      linkTo: '/dashboard/work-orders',
      linkText: 'Ver Todas',
      gradientFrom: 'blue',
      borderColor: 'blue-100',
    },
    {
      title: 'Técnicos',
      description: 'Adicione e gerencie os técnicos da sua equipe de campo.',
      icon: Users,
      linkTo: '/dashboard/technicians',
      linkText: 'Ver Técnicos',
      gradientFrom: 'purple',
      borderColor: 'purple-100',
    },
    {
      title: 'Relatórios',
      description: 'Acesse relatórios e estatísticas detalhadas sobre sua operação.',
      icon: BarChart3,
      linkTo: '/dashboard/reports',
      linkText: 'Ver Relatórios',
      gradientFrom: 'emerald',
      borderColor: 'emerald-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {quickActions.map((action) => (
        <QuickActionCard
          key={action.title}
          title={action.title}
          description={action.description}
          icon={action.icon}
          linkTo={action.linkTo}
          linkText={action.linkText}
          gradientFrom={action.gradientFrom}
          borderColor={action.borderColor}
        />
      ))}
    </div>
  );
};

export default QuickActionGrid;
