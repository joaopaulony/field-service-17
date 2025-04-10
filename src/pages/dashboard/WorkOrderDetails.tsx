import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  User, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Pencil, 
  Trash2,
  Upload,
  Building,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
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
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { fetchWorkOrderById, updateWorkOrder, deleteWorkOrder } from '@/services/workOrderService';
import { addWorkOrderPhoto, deleteWorkOrderPhoto } from '@/services/photoService';
import { WorkOrder, WorkOrderStatus } from '@/types/workOrders';

const WorkOrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState('');
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const [isDeletePhotoOpen, setIsDeletePhotoOpen] = useState(false);
  
  // Consulta para buscar ordem de serviço
  const { data: workOrder, isLoading, error } = useQuery({
    queryKey: ['workOrder', id],
    queryFn: () => fetchWorkOrderById(id!),
    enabled: !!id
  });
  
  // Mutação para atualizar ordem de serviço
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<WorkOrder> }) => 
      updateWorkOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrder', id] });
      toast({
        title: "Ordem de serviço atualizada",
        description: "As informações foram atualizadas com sucesso."
      });
      setIsAddNoteOpen(false);
      setNotes('');
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar ordem de serviço",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Mutação para excluir ordem de serviço
  const deleteMutation = useMutation({
    mutationFn: deleteWorkOrder,
    onSuccess: () => {
      toast({
        title: "Ordem de serviço excluída",
        description: "A ordem de serviço foi excluída com sucesso."
      });
      navigate('/dashboard/work-orders');
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir ordem de serviço",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Mutação para adicionar foto
  const addPhotoMutation = useMutation({
    mutationFn: ({ workOrderId, file, description }: { workOrderId: string, file: File, description?: string }) => 
      addWorkOrderPhoto(workOrderId, file, description || ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrder', id] });
      toast({
        title: "Foto adicionada",
        description: "A foto foi adicionada com sucesso à ordem de serviço."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao adicionar foto",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Mutação para excluir foto
  const deletePhotoMutation = useMutation({
    mutationFn: deleteWorkOrderPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrder', id] });
      toast({
        title: "Foto excluída",
        description: "A foto foi excluída com sucesso."
      });
      setIsDeletePhotoOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir foto",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Funções auxiliares
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Não definida';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getStatusBadge = (status: WorkOrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-500">Pendente</span>
          </div>
        );
      case 'in_progress':
        return (
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-500">Em Andamento</span>
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-green-500">Concluído</span>
          </div>
        );
      default:
        return null;
    }
  };
  
  const handleAddNote = () => {
    if (!id || !notes.trim()) return;
    
    updateMutation.mutate({
      id,
      data: {
        notes: notes.trim()
      }
    });
  };
  
  const handleStatusChange = (status: WorkOrderStatus) => {
    if (!id) return;
    
    updateMutation.mutate({
      id,
      data: { status }
    });
  };
  
  const handleDeleteWorkOrder = () => {
    if (!id) return;
    deleteMutation.mutate(id);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;
    
    addPhotoMutation.mutate({ workOrderId: id, file, description: '' });
    e.target.value = '';
  };
  
  const openDeletePhotoDialog = (photoId: string) => {
    setSelectedPhotoId(photoId);
    setIsDeletePhotoOpen(true);
  };
  
  const handleDeletePhoto = () => {
    if (!selectedPhotoId) return;
    deletePhotoMutation.mutate(selectedPhotoId);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando detalhes da ordem de serviço...</p>
        </div>
      </div>
    );
  }
  
  if (error || !workOrder) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link to="/dashboard/work-orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <Card className="text-center py-12">
          <CardContent>
            <h2 className="text-xl font-bold mb-2">Ordem de Serviço não encontrada</h2>
            <p className="text-muted-foreground mb-6">
              Não foi possível encontrar os detalhes desta ordem de serviço.
            </p>
            <Button asChild>
              <Link to="/dashboard/work-orders">Voltar para lista</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/dashboard/work-orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{workOrder.id}</h1>
            {getStatusBadge(workOrder.status)}
          </div>
          <p className="text-muted-foreground">{workOrder.title}</p>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Data de Criação</p>
            <p className="text-sm text-muted-foreground">{formatDate(workOrder.created_at)}</p>
          </div>
        </div>
        
        {workOrder.scheduled_date && (
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Data Agendada</p>
              <p className="text-sm text-muted-foreground">{formatDate(workOrder.scheduled_date)}</p>
            </div>
          </div>
        )}
        
        {workOrder.completion_date && workOrder.status === 'completed' && (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm font-medium">Data de Conclusão</p>
              <p className="text-sm text-muted-foreground">{formatDate(workOrder.completion_date)}</p>
            </div>
          </div>
        )}
      </div>
      
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="photos">Fotos</TabsTrigger>
          <TabsTrigger value="signature">Assinatura</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Ordem de Serviço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-muted-foreground">Cliente</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{workOrder.client_name || 'Não informado'}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Local</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{workOrder.location || 'Não informado'}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Técnico Responsável</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">
                      {workOrder.technician ? workOrder.technician.name : 'Não atribuído'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    {getStatusBadge(workOrder.status)}
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-muted-foreground">Descrição</Label>
                <p className="mt-1">
                  {workOrder.description || 'Sem descrição.'}
                </p>
              </div>
              
              {workOrder.notes && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-muted-foreground">Observações</Label>
                    <p className="mt-1 whitespace-pre-line">
                      {workOrder.notes}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between">
              <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
                <Button onClick={() => setIsAddNoteOpen(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Adicionar Observação
                </Button>
                
                <Button 
                  variant="outline" 
                  asChild
                >
                  <Link to={`/dashboard/work-orders/${workOrder.id}/edit`}>
                    <FileText className="mr-2 h-4 w-4" />
                    Editar OS
                  </Link>
                </Button>
              </div>
              
              <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir OS
                </Button>
              </div>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Alterar Status</CardTitle>
              <CardDescription>
                Atualize o status desta ordem de serviço.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant={workOrder.status === 'pending' ? 'default' : 'outline'}
                  onClick={() => handleStatusChange('pending')}
                  className={workOrder.status === 'pending' ? 'bg-amber-500 hover:bg-amber-600' : ''}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Pendente
                </Button>
                
                <Button 
                  variant={workOrder.status === 'in_progress' ? 'default' : 'outline'}
                  onClick={() => handleStatusChange('in_progress')}
                  className={workOrder.status === 'in_progress' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Em Andamento
                </Button>
                
                <Button 
                  variant={workOrder.status === 'completed' ? 'default' : 'outline'}
                  onClick={() => handleStatusChange('completed')}
                  className={workOrder.status === 'completed' ? 'bg-green-500 hover:bg-green-600' : ''}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Concluído
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="photos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fotos da Ordem de Serviço</CardTitle>
              <CardDescription>
                Visualize ou adicione fotos relacionadas a esta ordem de serviço.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Label htmlFor="photo-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col items-center justify-center h-32">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Clique para adicionar foto</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Suporta imagens JPG, JPEG ou PNG até 5MB.
                      </p>
                    </div>
                  </div>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={addPhotoMutation.isPending}
                  />
                </Label>
                {addPhotoMutation.isPending && (
                  <div className="text-center mt-2">
                    <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-sm text-muted-foreground mt-1">Enviando foto...</p>
                  </div>
                )}
              </div>
              
              {!workOrder.photos || workOrder.photos.length === 0 ? (
                <div className="text-center py-12 border rounded-lg">
                  <p className="text-muted-foreground">
                    Nenhuma foto adicionada a esta ordem de serviço.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {workOrder.photos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <div className="aspect-square overflow-hidden rounded-lg border">
                        <img
                          src={photo.photo_url}
                          alt="Foto da ordem de serviço"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute bottom-2 right-2"
                          onClick={() => openDeletePhotoDialog(photo.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute bottom-2 left-2"
                          asChild
                        >
                          <a href={photo.photo_url} target="_blank" rel="noopener noreferrer">
                            Ampliar
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="signature" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assinatura</CardTitle>
              <CardDescription>
                Visualize a assinatura coletada após a conclusão do serviço.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {workOrder.signature_url ? (
                <div className="border rounded-lg p-4">
                  <img
                    src={workOrder.signature_url}
                    alt="Assinatura do cliente"
                    className="max-w-full h-auto mx-auto"
                  />
                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Assinatura coletada em {formatDate(workOrder.completion_date)}
                    </p>
                    <Button className="mt-2" asChild>
                      <a href={workOrder.signature_url} target="_blank" rel="noopener noreferrer">
                        Ver assinatura original
                      </a>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <p className="text-muted-foreground">
                    Assinatura ainda não coletada.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    A assinatura será coletada quando o técnico concluir o serviço.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialog para adicionar observação */}
      <Dialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Observação</DialogTitle>
            <DialogDescription>
              Adicione uma observação ou nota importante para esta ordem de serviço.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Digite sua observação aqui..."
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setNotes('');
              setIsAddNoteOpen(false);
            }}>
              Cancelar
            </Button>
            <Button 
              onClick={handleAddNote}
              disabled={!notes.trim() || updateMutation.isPending}
            >
              {updateMutation.isPending ? "Salvando..." : "Salvar Observação"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* AlertDialog para confirmar exclusão da OS */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Ordem de Serviço</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta ordem de serviço? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteWorkOrder}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* AlertDialog para confirmar exclusão de foto */}
      <AlertDialog open={isDeletePhotoOpen} onOpenChange={setIsDeletePhotoOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Foto</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta foto? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletePhoto}
              className="bg-red-600 hover:bg-red-700"
            >
              {deletePhotoMutation.isPending ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WorkOrderDetails;
