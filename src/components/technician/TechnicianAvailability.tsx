
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus } from 'lucide-react';
import { Technician, TechnicianAvailability } from '@/types/workOrders';
import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  setTechnicianAvailability,
  updateTechnicianAvailability
} from '@/services/technician';

interface TechnicianAvailabilityProps {
  technician: Technician;
}

const daysOfWeek = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terça-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sábado' },
];

// Generate time options in 30 minute increments
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      const time = `${formattedHour}:${formattedMinute}`;
      options.push({ value: time, label: time });
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

const TechnicianAvailabilityManager: React.FC<TechnicianAvailabilityProps> = ({ technician }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newAvailability, setNewAvailability] = useState({
    day: "1", // Monday by default
    startTime: "08:00",
    endTime: "17:00",
  });
  
  const techAvailability = technician.availability || [];

  // Group availability by day
  const availabilityByDay = techAvailability.reduce((acc, avail) => {
    const day = avail.day_of_week;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(avail);
    return acc;
  }, {} as Record<number, TechnicianAvailability[]>);

  const addAvailabilityMutation = useMutation({
    mutationFn: () => setTechnicianAvailability(
      technician.id,
      Number(newAvailability.day),
      newAvailability.startTime,
      newAvailability.endTime
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technician'] });
      toast({
        title: 'Disponibilidade adicionada',
        description: 'Horário de disponibilidade adicionado com sucesso.',
      });
    },
    onError: (error) => {
      console.error("Error adding availability:", error);
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar a disponibilidade. Tente novamente.',
        variant: 'destructive',
      });
    },
  });

  const updateAvailabilityMutation = useMutation({
    mutationFn: (params: { id: string, isAvailable: boolean }) => 
      updateTechnicianAvailability(params.id, { is_available: params.isAvailable }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technician'] });
      toast({
        title: 'Disponibilidade atualizada',
        description: 'Status de disponibilidade atualizado com sucesso.',
      });
    },
    onError: (error) => {
      console.error("Error updating availability:", error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a disponibilidade. Tente novamente.',
        variant: 'destructive',
      });
    },
  });

  const handleAddAvailability = () => {
    if (Number(newAvailability.startTime.replace(':', '')) >= Number(newAvailability.endTime.replace(':', ''))) {
      toast({
        title: 'Erro de validação',
        description: 'A hora de início deve ser anterior à hora de término.',
        variant: 'destructive',
      });
      return;
    }
    addAvailabilityMutation.mutate();
  };

  const handleToggleAvailability = (id: string, currentValue: boolean) => {
    updateAvailabilityMutation.mutate({ id, isAvailable: !currentValue });
  };

  return (
    <Card className="shadow-md mt-6">
      <CardHeader>
        <CardTitle>Disponibilidade Semanal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Add new availability */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Select
              value={newAvailability.day}
              onValueChange={(value) => setNewAvailability(prev => ({ ...prev, day: value }))}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Dia da semana" />
              </SelectTrigger>
              <SelectContent>
                {daysOfWeek.map((day) => (
                  <SelectItem key={day.value} value={day.value.toString()}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={newAvailability.startTime}
              onValueChange={(value) => setNewAvailability(prev => ({ ...prev, startTime: value }))}
            >
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue placeholder="Início" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={`start-${time.value}`} value={time.value}>
                    {time.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={newAvailability.endTime}
              onValueChange={(value) => setNewAvailability(prev => ({ ...prev, endTime: value }))}
            >
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue placeholder="Término" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={`end-${time.value}`} value={time.value}>
                    {time.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleAddAvailability} 
              disabled={addAvailabilityMutation.isPending}
              className="whitespace-nowrap"
            >
              {addAvailabilityMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </>
              )}
            </Button>
          </div>
          
          {/* Current availability by day */}
          <div className="space-y-6">
            {daysOfWeek.map((day) => {
              const dayAvailability = availabilityByDay[day.value] || [];
              return (
                <div key={day.value} className="space-y-2">
                  <h3 className="font-medium">{day.label}</h3>
                  {dayAvailability.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      Sem horários configurados para este dia.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {dayAvailability.map((avail) => (
                        <div key={avail.id} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                          <div>
                            <span>
                              {avail.start_time.substring(0, 5)} - {avail.end_time.substring(0, 5)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`available-${avail.id}`} className="text-sm">
                              Disponível
                            </Label>
                            <Switch
                              id={`available-${avail.id}`}
                              checked={avail.is_available}
                              onCheckedChange={() => handleToggleAvailability(avail.id, avail.is_available)}
                              disabled={updateAvailabilityMutation.isPending}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicianAvailabilityManager;
