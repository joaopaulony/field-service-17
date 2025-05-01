
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { createWorkOrder } from '@/services/workOrderService';
import { fetchTechnicians } from '@/services/technicianService';
import { CreateWorkOrderDTO } from '@/types/workOrders';

const CreateWorkOrder = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateWorkOrderDTO>({
    title: '',
    description: '',
    client_name: '',
    location: '',
    technician_id: '',
    scheduled_date: '',
  });

  // Consulta para buscar técnicos
  const { data: technicians = [] } = useQuery({
    queryKey: ['technicians'],
    queryFn: fetchTechnicians
  });
  
  // Mutação para criar ordem de serviço
  const createMutation = useMutation({
    mutationFn: createWorkOrder,
    onSuccess: (data) => {
      toast({
        title: "Ordem de Serviço criada",
        description: "A OS foi criada com sucesso."
      });
      navigate(`/dashboard/work-orders/${data.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar Ordem de Serviço",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <Button variant="outline" size="icon" asChild>
          <Link to="/dashboard/work-orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nova Ordem de Serviço</h1>
          <p className="text-muted-foreground">Crie uma nova ordem de serviço e atribua a um técnico.</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input 
                  id="title" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ex: Manutenção de ar-condicionado" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="client_name">Cliente</Label>
                <Input 
                  id="client_name" 
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleInputChange}
                  placeholder="Nome do cliente" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea 
                id="description" 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Descreva os detalhes da ordem de serviço..." 
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Endereço</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="location" 
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Endereço completo" 
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="scheduled_date">Data Agendada</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="scheduled_date" 
                    name="scheduled_date"
                    value={formData.scheduled_date}
                    onChange={handleInputChange}
                    type="datetime-local"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Detalhes da Tarefa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="technician_id">Técnico Responsável</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Select 
                  name="technician_id" 
                  value={formData.technician_id} 
                  onValueChange={(value) => handleSelectChange('technician_id', value)}
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Selecione um técnico" />
                  </SelectTrigger>
                  <SelectContent>
                    {technicians.length > 0 ? (
                      technicians.map((tech) => (
                        <SelectItem key={tech.id} value={tech.id}>
                          {tech.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no_technicians" disabled>
                        Nenhum técnico cadastrado
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Separator />
            
            <div className="bg-muted/30 rounded-md p-4">
              <p className="text-sm text-muted-foreground">
                Após criar a ordem de serviço, você poderá adicionar fotos, cheklist e outras informações na página de detalhes.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-4 pt-2">
          <Button variant="outline" type="button" asChild>
            <Link to="/dashboard/work-orders">Cancelar</Link>
          </Button>
          <Button 
            type="submit" 
            disabled={!formData.title || createMutation.isPending}
          >
            {createMutation.isPending ? "Criando..." : "Criar Ordem de Serviço"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateWorkOrder;
