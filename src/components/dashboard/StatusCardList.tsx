
import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, XCircle } from 'lucide-react';
import StatusCard from './StatusCard';

type StatusCountsType = {
  pending: number;
  in_progress: number;
  completed: number;
  canceled: number;
};

type StatusCardListProps = {
  statusCounts: StatusCountsType;
};

const StatusCardList = ({ statusCounts }: StatusCardListProps) => {
  const statusData = [
    { 
      status: 'Pendente', 
      value: statusCounts.pending, 
      icon: <Clock className="h-5 w-5 text-amber-500" />,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    { 
      status: 'Em Andamento', 
      value: statusCounts.in_progress, 
      icon: <AlertTriangle className="h-5 w-5 text-blue-500" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    { 
      status: 'Concluído', 
      value: statusCounts.completed, 
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    { 
      status: 'Cancelado', 
      value: statusCounts.canceled, 
      icon: <XCircle className="h-5 w-5 text-red-500" />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {statusData.map((item) => (
        <StatusCard 
          key={item.status}
          status={item.status}
          value={item.value}
          icon={item.icon}
          bgColor={item.bgColor}
          borderColor={item.borderColor}
        />
      ))}
    </div>
  );
};

export default StatusCardList;
