
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Technician } from '@/types/workOrders';
import { updateTechnician } from '@/services/technician';
import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

interface TechnicianProfileSettingsProps {
  technician: Technician;
}

const TechnicianProfileSettings: React.FC<TechnicianProfileSettingsProps> = ({ technician }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [profile, setProfile] = useState({
    name: technician.name,
    email: technician.email,
    phone: technician.phone || '',
    bio: technician.bio || '',
    specialization: technician.specialization || '',
    hourly_rate: technician.hourly_rate || 0,
    years_experience: technician.years_experience || 0,
    max_daily_work_orders: technician.max_daily_work_orders || 5,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<Technician>) => updateTechnician(technician.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technician'] });
      toast({
        title: 'Perfil atualizado',
        description: 'Suas informações foram atualizadas com sucesso.',
      });
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível salvar suas informações. Tente novamente.',
        variant: 'destructive',
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: name === 'hourly_rate' || name === 'years_experience' || name === 'max_daily_work_orders'
        ? Number(value)
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profile);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Informações do Perfil</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization">Especialização</Label>
              <Input
                id="specialization"
                name="specialization"
                value={profile.specialization}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hourly_rate">Taxa Horária (R$)</Label>
              <Input
                id="hourly_rate"
                name="hourly_rate"
                type="number"
                min="0"
                step="0.01"
                value={profile.hourly_rate}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="years_experience">Anos de Experiência</Label>
              <Input
                id="years_experience"
                name="years_experience"
                type="number"
                min="0"
                value={profile.years_experience}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_daily_work_orders">Máximo de Ordens Diárias</Label>
              <Input
                id="max_daily_work_orders"
                name="max_daily_work_orders"
                type="number"
                min="1"
                value={profile.max_daily_work_orders}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Biografia</Label>
            <Textarea
              id="bio"
              name="bio"
              value={profile.bio || ''}
              onChange={handleChange}
              rows={4}
            />
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TechnicianProfileSettings;
