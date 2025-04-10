
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  UserPlus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Check, 
  X,
  Mail,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { fetchTechnicians, createTechnician, updateTechnician, deleteTechnician } from '@/services/technicianService';
import { Technician, CreateTechnicianDTO } from '@/types/workOrders';
import { Badge } from '@/components/ui/badge';

const Technicians = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [formData, setFormData] = useState<CreateTechnicianDTO>({
    name: '',
    email: '',
    phone: ''
  });
  
  // Consulta para buscar técnicos
  const { data: technicians = [], isLoading } = useQuery({
    queryKey: ['technicians'],
    queryFn: fetchTechnicians
  });
  
  // Mutação para criar técnico
  const createMutation = useMutation({
    mutationFn: createTechnician,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technicians'] });
      toast({
        title: "Técnico adicionado",
        description: "O técnico foi adicionado com sucesso."
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
  
  // Mutação para atualizar técnico
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
  
  // Mutação para excluir técnico
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
  
  // Filtrar técnicos por termo de busca
  const filteredTechnicians = technicians.filter(technician => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      technician.name.toLowerCase().includes(searchLower) ||
      technician.email.toLowerCase().includes(searchLower) ||
      (technician.phone && technician.phone.includes(searchTerm))
    );
  });
  
  // Funções auxiliares
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: ''
    });
    setSelectedTechnician(null);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      phone: technician.phone || ''
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
      
      {/* Filtros */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar técnicos..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Tabela */}
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  Carregando técnicos...
                </TableCell>
              </TableRow>
            ) : filteredTechnicians.length > 0 ? (
              filteredTechnicians.map((technician) => (
                <TableRow key={technician.id}>
                  <TableCell className="font-medium">{technician.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {technician.email}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {technician.phone ? (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {technician.phone}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Não informado</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {technician.active ? (
                      <Badge variant="default" className="bg-green-500">Ativo</Badge>
                    ) : (
                      <Badge variant="outline" className="text-red-500">Inativo</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(technician)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleTechnicianStatus(technician)}>
                          {technician.active ? (
                            <>
                              <X className="mr-2 h-4 w-4" />
                              <span>Desativar</span>
                            </>
                          ) : (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              <span>Ativar</span>
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600" 
                          onClick={() => openDeleteDialog(technician)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Excluir</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  Nenhum técnico encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Dialog para adicionar técnico */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Técnico</DialogTitle>
            <DialogDescription>
              Preencha as informações para adicionar um novo técnico à sua equipe.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                placeholder="Nome completo do técnico"
                value={formData.name}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone (opcional)</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetForm();
              setIsAddOpen(false);
            }}>
              Cancelar
            </Button>
            <Button 
              onClick={handleAddTechnician}
              disabled={!formData.name || !formData.email || createMutation.isPending}
            >
              {createMutation.isPending ? "Adicionando..." : "Adicionar Técnico"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog para editar técnico */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Técnico</DialogTitle>
            <DialogDescription>
              Atualize as informações do técnico.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                name="name"
                placeholder="Nome completo do técnico"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                placeholder="email@exemplo.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Telefone (opcional)</Label>
              <Input
                id="edit-phone"
                name="phone"
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetForm();
              setIsEditOpen(false);
            }}>
              Cancelar
            </Button>
            <Button 
              onClick={handleUpdateTechnician}
              disabled={!formData.name || !formData.email || updateMutation.isPending}
            >
              {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* AlertDialog para confirmar exclusão */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o técnico
              <strong> {selectedTechnician?.name}</strong> e removerá suas informações do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteTechnician}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? "Excluindo..." : "Excluir Técnico"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Technicians;
