
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

type StatusCardProps = {
  status: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
};

const StatusCard = ({ status, value, icon, bgColor, borderColor }: StatusCardProps) => {
  return (
    <Card className={`shadow-sm border ${borderColor}`}>
      <CardContent className={`p-6 ${bgColor} bg-opacity-30 rounded-lg`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{status}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div className={`${bgColor} p-3 rounded-full`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusCard;
