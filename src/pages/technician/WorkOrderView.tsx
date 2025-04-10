
import React, { useState, useRef } from 'react';
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
  Camera,
  Upload,
  Building,
  MessageSquare,
  Edit,
  Send,
  Pen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
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
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { fetchWorkOrderById, updateWorkOrder, addWorkOrderPhoto, saveSignature } from '@/services/workOrderService';
import { WorkOrder, WorkOrderStatus } from '@/types/workOrders';

const WorkOrderView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notes, setNotes] = useState('');
  const [isAddNotesOpen, setIsAddNotesOpen] = useState(false);
  const [isPhotoViewOpen, setIsPhotoViewOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
  const [isSignatureOpen, setIsSignatureOpen] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Consulta para buscar ordem de serviço
  const { data: workOrder, isLoading, error } = useQuery({
    queryKey: ['techWorkOrder', id],
    queryFn: () => fetchWorkOrderById(id!),
    enabled: !!id
  });
  
  // Mutação para atualizar ordem de serviço
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<WorkOrder> }) => 
      updateWorkOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['techWorkOrder', id] });
      toast({
        title: "Ordem de serviço atualizada",
        description: "As informações foram atualizadas com sucesso."
      });
      setIsAddNotesOpen(false);
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
  
  // Mutação para adicionar foto
  const addPhotoMutation = useMutation({
    mutationFn: ({ workOrderId, file }: { workOrderId: string, file: File }) => 
      addWorkOrderPhoto(workOrderId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['techWorkOrder', id] });
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
  
  // Mutação para salvar assinatura
  const signatureMutation = useMutation({
    mutationFn: ({ workOrderId, signatureFile }: { workOrderId: string, signatureFile: File }) => 
      saveSignature(workOrderId, signatureFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['techWorkOrder', id] });
      toast({
        title: "Ordem de serviço concluída",
        description: "A assinatura foi coletada e a ordem de serviço foi concluída com sucesso."
      });
      setIsSignatureOpen(false);
      navigate('/tech');
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao salvar assinatura",
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
  
  const handleStatusChange = (status: WorkOrderStatus) => {
    if (!id) return;
    
    updateMutation.mutate({
      id,
      data: { status }
    });
  };
  
  const handleAddNotes = () => {
    if (!id || !notes.trim()) return;
    
    updateMutation.mutate({
      id,
      data: {
        notes: notes.trim()
      }
    });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;
    
    addPhotoMutation.mutate({ workOrderId: id, file });
    e.target.value = '';
  };
  
  const takePicture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const viewPhoto = (url: string) => {
    setCurrentPhoto(url);
    setIsPhotoViewOpen(true);
  };
  
  // Funções para o canvas de assinatura
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let clientX, clientY;
    
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let clientX, clientY;
    
    if ('touches' in e) {
      e.preventDefault(); // Prevent scrolling on touch devices
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };
  
  const endDrawing = () => {
    setIsDrawing(false);
  };
  
  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  
  const saveSignatureImage = () => {
    const canvas = canvasRef.current;
    if (!canvas || !id) return;
    
    canvas.toBlob((blob) => {
      if (!blob) {
        toast({
          title: "Erro ao salvar assinatura",
          description: "Não foi possível converter a assinatura para uma imagem.",
          variant: "destructive"
        });
        return;
      }
      
      const file = new File([blob], `signature-${id}.png`, { type: 'image/png' });
      signatureMutation.mutate({ workOrderId: id, signatureFile: file });
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando detalhes da ordem de serviço...</p>
        </div>
      </div>
    );
  }
  
  if (error || !workOrder) {
    return (
      <div className="mobile-container">
        <div className="mb-6">
          <Button variant="outline" size="icon" asChild className="mt-4">
            <Link to="/tech">
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
              <Link to="/tech">Voltar para o início</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="mobile-container pb-20">
      <div className="flex items-center gap-4 mt-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link to="/tech">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold">{workOrder.id}</h1>
            {getStatusBadge(workOrder.status)}
          </div>
          <p className="text-sm text-muted-foreground">{workOrder.title}</p>
        </div>
      </div>
      
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="info">Detalhes</TabsTrigger>
          <TabsTrigger value="photos">Fotos</TabsTrigger>
          <TabsTrigger value="actions">Ações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Cliente</p>
                </div>
                <p className="text-sm ml-6">{workOrder.client_name || 'Não informado'}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Localização</p>
                </div>
                <p className="text-sm ml-6">{workOrder.location || 'Não informado'}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Data Agendada</p>
                </div>
                <p className="text-sm ml-6">{formatDate(workOrder.scheduled_date)}</p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Descrição do Serviço</p>
                <p className="text-sm">{workOrder.description || 'Sem descrição.'}</p>
              </div>
              
              {workOrder.notes && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">Observações</p>
                    </div>
                    <p className="text-sm ml-6 whitespace-pre-line">{workOrder.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <div className="fixed bottom-16 right-4">
            <Button 
              className="rounded-full h-14 w-14 shadow-lg" 
              onClick={() => setIsAddNotesOpen(true)}
            >
              <Edit className="h-6 w-6" />
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="photos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Fotos</CardTitle>
            </CardHeader>
            <CardContent>
              {!workOrder.photos || workOrder.photos.length === 0 ? (
                <div className="text-center py-8 border rounded-lg mb-4">
                  <p className="text-muted-foreground">
                    Nenhuma foto adicionada a esta ordem de serviço.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {workOrder.photos.map((photo) => (
                    <div 
                      key={photo.id} 
                      className="aspect-square rounded-lg overflow-hidden border"
                      onClick={() => viewPhoto(photo.photo_url)}
                    >
                      <img
                        src={photo.photo_url}
                        alt="Foto da ordem de serviço"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
              
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                capture="environment"
              />
            </CardContent>
          </Card>
          
          <div className="fixed bottom-16 right-4">
            <Button 
              className="rounded-full h-14 w-14 shadow-lg" 
              onClick={takePicture}
              disabled={addPhotoMutation.isPending}
            >
              <Camera className="h-6 w-6" />
            </Button>
          </div>
          
          {addPhotoMutation.isPending && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-background rounded-lg p-6 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Enviando foto...</p>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status da Ordem</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <Button 
                  variant={workOrder.status === 'pending' ? 'default' : 'outline'}
                  onClick={() => handleStatusChange('pending')}
                  className={`justify-start h-12 ${workOrder.status === 'pending' ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
                  disabled={workOrder.status === 'completed'}
                >
                  <Clock className="mr-2 h-5 w-5" />
                  Pendente
                </Button>
                
                <Button 
                  variant={workOrder.status === 'in_progress' ? 'default' : 'outline'}
                  onClick={() => handleStatusChange('in_progress')}
                  className={`justify-start h-12 ${workOrder.status === 'in_progress' ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
                  disabled={workOrder.status === 'completed'}
                >
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Em Andamento
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => setIsCompleteDialogOpen(true)}
                  className="justify-start h-12 border-green-500 text-green-500 hover:bg-green-50"
                  disabled={workOrder.status === 'completed'}
                >
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Concluir Ordem de Serviço
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {workOrder.status === 'completed' && workOrder.signature_url && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Assinatura</CardTitle>
              </CardHeader>
              <CardContent>
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
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Dialog para adicionar observações */}
      <Dialog open={isAddNotesOpen} onOpenChange={setIsAddNotesOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Observações</DialogTitle>
            <DialogDescription>
              Adicione observações ou notas sobre esta ordem de serviço.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Digite suas observações aqui..."
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setNotes('');
              setIsAddNotesOpen(false);
            }}>
              Cancelar
            </Button>
            <Button 
              onClick={handleAddNotes}
              disabled={!notes.trim() || updateMutation.isPending}
            >
              <Send className="mr-2 h-4 w-4" />
              {updateMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog para visualizar foto */}
      <Dialog open={isPhotoViewOpen} onOpenChange={setIsPhotoViewOpen}>
        <DialogContent className="sm:max-w-md p-1">
          <div className="relative">
            {currentPhoto && (
              <img
                src={currentPhoto}
                alt="Foto da ordem de serviço"
                className="w-full h-auto"
              />
            )}
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 bg-background rounded-full"
              onClick={() => setIsPhotoViewOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Dialog para confirmar conclusão */}
      <AlertDialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Concluir Ordem de Serviço</AlertDialogTitle>
            <AlertDialogDescription>
              Para concluir esta ordem de serviço, você precisa coletar a assinatura do cliente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setIsCompleteDialogOpen(false);
              setIsSignatureOpen(true);
            }}>
              Coletar Assinatura
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Dialog para assinatura */}
      <Dialog open={isSignatureOpen} onOpenChange={setIsSignatureOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Coletar Assinatura</DialogTitle>
            <DialogDescription>
              Peça ao cliente para assinar abaixo para concluir a ordem de serviço.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="border rounded-lg p-1 bg-gray-50 mb-2">
              <canvas
                ref={canvasRef}
                width={280}
                height={200}
                className="w-full touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseLeave={endDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={endDrawing}
              />
            </div>
            <div className="text-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearSignature}
              >
                Limpar
              </Button>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button 
              onClick={saveSignatureImage}
              disabled={signatureMutation.isPending}
              className="w-full"
            >
              <Pen className="mr-2 h-4 w-4" />
              {signatureMutation.isPending ? "Salvando..." : "Concluir Ordem de Serviço"}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsSignatureOpen(false)}
              className="w-full"
              disabled={signatureMutation.isPending}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkOrderView;
