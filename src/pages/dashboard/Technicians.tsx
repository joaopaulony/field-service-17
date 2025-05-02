
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchTechnicians, 
  createTechnician, 
  updateTechnician, 
  deleteTechnician 
} from '@/services/technician';
import { createTechnicianAuthAccount } from '@/services/technician/technicianAuth';
import { Technician, CreateTechnicianDTO } from '@/types/workOrders';

// Import custom components
import TechnicianList from '@/components/technicians/TechnicianList';
import TechnicianForm from '@/components/technicians/TechnicianForm';
import TechnicianSearch from '@/components/technicians/TechnicianSearch';
import DeleteTechnicianDialog from '@/components/technicians/DeleteTechnicianDialog';

const Technicians = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [formData, setFormData] = useState<CreateTechnicianDTO & { password?: string }>({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  
  // Query to fetch technicians
  const { data: technicians = [], isLoading } = useQuery({
    queryKey: ['technicians'],
    queryFn: fetchTechnicians
  });
  
  // Mutation to create technician
  const createMutation = useMutation({
    mutationFn: async (data: CreateTechnicianDTO & { password?: string }) => {
      const { password, ...technicianData } = data;
      
      // First create auth account if password is provided
      if (password) {
        try {
          await createTechnicianAuthAccount(data.email, password);
        } catch (error: any) {
          // If the account already exists, we can continue but show a warning
          if (error.message?.includes('already registered')) {
            toast({
              title: "Aviso",
              description: "Já existe uma conta com este e-mail. O técnico será vinculado a esta conta existente.",
              variant: "warning"
            });
          } else {
            throw error;
          }
        }
      }
      
      // Then create the technician record
      return createTechnician(technicianData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technicians'] });
      toast({
        title: "Técnico adicionado",
        description: "O técnico foi adicionado com sucesso e poderá acessar o sistema."
      });
      resetForm();
      setIsAddOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao adicionar técnico",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Mutation to update technician
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Technician> }) => 
      updateTechnician(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technicians'] });
      toast({
        title: "Técnico atualizado",
        description: "As informações do técnico foram atualizadas com sucesso."
      });
      resetForm();
      setIsEditOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar técnico",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Mutation to delete technician
  const deleteMutation = useMutation({
    mutationFn: deleteTechnician,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technicians'] });
      toast({
        title: "Técnico excluído",
        description: "O técnico foi excluído com sucesso."
      });
      setIsDeleteOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir técnico",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Filter technicians by search term
  const filteredTechnicians = technicians.filter(technician => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      technician.name.toLowerCase().includes(searchLower) ||
      technician.email.toLowerCase().includes(searchLower) ||
      (technician.phone && technician.phone.includes(searchTerm))
    );
  });
  
  // Helper functions
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: ''
    });
    setSelectedTechnician(null);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddTechnician = () => {
    createMutation.mutate(formData);
  };
  
  const handleUpdateTechnician = () => {
    if (!selectedTechnician) return;
    
    updateMutation.mutate({
      id: selectedTechnician.id,
      data: formData
    });
  };
  
  const handleDeleteTechnician = () => {
    if (!selectedTechnician) return;
    deleteMutation.mutate(selectedTechnician.id);
  };
  
  const openEditDialog = (technician: Technician) => {
    setSelectedTechnician(technician);
    setFormData({
      name: technician.name,
      email: technician.email,
      phone: technician.phone || '',
      bio: technician.bio || '',
      specialization: technician.specialization || ''
    });
    setIsEditOpen(true);
  };
  
  const openDeleteDialog = (technician: Technician) => {
    setSelectedTechnician(technician);
    setIsDeleteOpen(true);
  };
  
  const toggleTechnicianStatus = (technician: Technician) => {
    updateMutation.mutate({
      id: technician.id,
      data: { active: !technician.active }
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Técnicos</h1>
          <p className="text-muted-foreground">Gerencie os técnicos que irão executar as ordens de serviço.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Adicionar Técnico
        </Button>
      </div>
      
      {/* Search */}
      <TechnicianSearch 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />
      
      {/* Table */}
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Telefone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TechnicianList 
              technicians={filteredTechnicians} 
              isLoading={isLoading}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
              onToggleStatus={toggleTechnicianStatus}
            />
          </TableBody>
        </Table>
      </div>
      
      {/* Dialog for adding technician */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Técnico</DialogTitle>
            <DialogDescription>
              Preencha as informações para adicionar um novo técnico à sua equipe.
              Uma conta será criada para que o técnico acesse o sistema.
            </DialogDescription>
          </DialogHeader>
          <TechnicianForm
            formData={formData}
            onChange={handleInputChange}
            onCancel={() => {
              resetForm();
              setIsAddOpen(false);
            }}
            onSubmit={handleAddTechnician}
            isPending={createMutation.isPending}
            submitLabel="Adicionar Técnico"
            isCreating={true}
          />
        </DialogContent>
      </Dialog>
      
      {/* Dialog for editing technician */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Técnico</DialogTitle>
            <DialogDescription>
              Atualize as informações do técnico.
            </DialogDescription>
          </DialogHeader>
          <TechnicianForm
            formData={formData}
            onChange={handleInputChange}
            onCancel={() => {
              resetForm();
              setIsEditOpen(false);
            }}
            onSubmit={handleUpdateTechnician}
            isPending={updateMutation.isPending}
            submitLabel="Salvar Alterações"
            isCreating={false}
          />
        </DialogContent>
      </Dialog>
      
      {/* AlertDialog for confirming deletion */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DeleteTechnicianDialog 
          technician={selectedTechnician}
          isPending={deleteMutation.isPending}
          onDelete={handleDeleteTechnician}
        />
      </AlertDialog>
    </div>
  );
};

export default Technicians;
