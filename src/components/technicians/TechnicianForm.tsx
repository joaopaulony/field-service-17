
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { CreateTechnicianDTO } from '@/types/workOrders';
import { Textarea } from '@/components/ui/textarea';

interface TechnicianFormProps {
  formData: CreateTechnicianDTO & { password?: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCancel: () => void;
  onSubmit: () => void;
  isPending: boolean;
  submitLabel: string;
  isCreating: boolean;
}

const TechnicianForm: React.FC<TechnicianFormProps> = ({
  formData,
  onChange,
  onCancel,
  onSubmit,
  isPending,
  submitLabel,
  isCreating = true
}) => {
  return (
    <>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            name="name"
            placeholder="Nome completo do técnico"
            value={formData.name}
            onChange={onChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="email@exemplo.com"
            value={formData.email}
            onChange={onChange}
          />
        </div>
        
        {isCreating && (
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Senha para acesso do técnico"
              value={formData.password || ''}
              onChange={onChange}
            />
            <p className="text-xs text-muted-foreground">
              Esta senha será usada pelo técnico para acessar seu painel.
            </p>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone (opcional)</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="(00) 00000-0000"
            value={formData.phone || ''}
            onChange={onChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bio">Bio/Descrição (opcional)</Label>
          <Textarea
            id="bio"
            name="bio"
            placeholder="Breve descrição sobre o técnico"
            value={formData.bio || ''}
            onChange={onChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="specialization">Especialização (opcional)</Label>
          <Input
            id="specialization"
            name="specialization"
            placeholder="Ex: Elétrica, Hidráulica, etc"
            value={formData.specialization || ''}
            onChange={onChange}
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          onClick={onSubmit}
          disabled={!formData.name || !formData.email || (isCreating && !formData.password) || isPending}
        >
          {isPending ? "Processando..." : submitLabel}
        </Button>
      </DialogFooter>
    </>
  );
};

export default TechnicianForm;
