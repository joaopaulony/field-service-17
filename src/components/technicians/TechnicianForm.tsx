
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { CreateTechnicianDTO } from '@/types/workOrders';

interface TechnicianFormProps {
  formData: CreateTechnicianDTO;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onSubmit: () => void;
  isPending: boolean;
  submitLabel: string;
}

const TechnicianForm: React.FC<TechnicianFormProps> = ({
  formData,
  onChange,
  onCancel,
  onSubmit,
  isPending,
  submitLabel
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
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone (opcional)</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="(00) 00000-0000"
            value={formData.phone}
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
          disabled={!formData.name || !formData.email || isPending}
        >
          {isPending ? "Processando..." : submitLabel}
        </Button>
      </DialogFooter>
    </>
  );
};

export default TechnicianForm;
