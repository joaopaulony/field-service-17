
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  CheckCircle, 
  Clock, 
  MapPin, 
  User, 
  ClipboardList,
  ImagePlus,
  Signature,
  Save,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { fetchWorkOrderById, updateWorkOrder } from '@/services/workOrderService';
import { addWorkOrderPhoto, saveSignature } from '@/services/photoService';
import { WorkOrder, WorkOrderStatus } from '@/types/workOrders';
import PhotoGrid from '@/components/PhotoGrid';
import SignaturePad from 'react-signature-pad-wrapper';

const WorkOrderView = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [notes, setNotes] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoDescription, setPhotoDescription] = useState('');
  const [signaturePad, setSignaturePad] = useState<SignaturePad | null>(null);
  const [isSavingSignature, setIsSavingSignature] = useState(false);
  
  // Fetch Work Order
  const { data: workOrder, isLoading, refetch } = useQuery({
    queryKey: ['workOrder', id],
    queryFn: () => fetchWorkOrderById(id!),
  });
  
  // Update Work Order Mutation
  const updateMutation = useMutation({
    mutationFn: (updates: Partial<WorkOrder>) => updateWorkOrder(id!, updates),
    onSuccess: () => {
      toast({
        title: "Ordem de Serviço atualizada",
        description: "A OS foi atualizada com sucesso."
      });
      refetch(); // Refresh data
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar Ordem de Serviço",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Add Photo Mutation
  const addPhotoMutation = useMutation({
    mutationFn: () => addWorkOrderPhoto(id!, photoFile!, photoDescription),
    onSuccess: () => {
      toast({
        title: "Foto adicionada",
        description: "A foto foi adicionada à ordem de serviço."
      });
      setPhotoFile(null);
      setPhotoDescription('');
      refetch(); // Refresh data
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao adicionar foto",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Save Signature Mutation
  const saveSignatureMutation = useMutation({
    mutationFn: (signatureFile: File) => saveSignature(id!, signatureFile),
    onSuccess: () => {
      toast({
        title: "Assinatura salva",
        description: "A assinatura foi salva com sucesso."
      });
      refetch(); // Refresh data
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao salvar assinatura",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  useEffect(() => {
    if (workOrder) {
      setNotes(workOrder.notes || '');
    }
  }, [workOrder]);
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };
  
  const handleSaveNotes = async () => {
    updateMutation.mutate({ notes });
  };
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhotoFile(e.target.files[0]);
    }
  };
  
  const handleAddPhoto = async () => {
    if (!photoFile) {
      toast({
        title: "Selecione uma foto",
        description: "Por favor, selecione uma foto para adicionar."
      });
      return;
    }
    addPhotoMutation.mutate();
  };
  
  const handleSaveSignature = () => {
    if (signaturePad) {
      setIsSavingSignature(true);
      const dataUrl = signaturePad.toDataURL();
      if (dataUrl) {
        // Convert Data URL to a Blob
        const blob = dataURLtoBlob(dataUrl);
        const signatureFile = new File([blob], `signature_${id}.png`, { type: 'image/png' });
        
        saveSignatureMutation.mutate(signatureFile);
      } else {
        toast({
          title: "Erro ao salvar assinatura",
          description: "Nenhuma assinatura detectada.",
          variant: "destructive"
        });
      }
      setIsSavingSignature(false);
    }
  };
  
  const dataURLtoBlob = (dataUrl: string) => {
    const parts = dataUrl.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    
    return new Blob([uInt8Array], { type: contentType });
  };
  
  if (isLoading || !workOrder) {
    return (
      <div className="flex items-center justify-center h-full">
        <Clock className="mr-2 h-4 w-4 animate-spin" />
        Carregando ordem de serviço...
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="outline" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{workOrder.title}</h1>
          <p className="text-muted-foreground">
            Detalhes da ordem de serviço <Badge>{workOrder.id}</Badge>
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Detalhes da Ordem de Serviço */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Ordem de Serviço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Descrição:</span>
              <p className="text-sm">{workOrder.description || 'Nenhuma descrição fornecida.'}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Cliente:</span>
              <p className="text-sm">{workOrder.client_name || 'Não especificado'}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Localização:</span>
              <p className="text-sm">{workOrder.location || 'Não especificado'}</p>
            </div>
            
            {workOrder.scheduled_date && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Agendado para:</span>
                <p className="text-sm">{new Date(workOrder.scheduled_date).toLocaleString()}</p>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Status:</span>
              <Badge variant="secondary">{workOrder.status}</Badge>
            </div>
          </CardContent>
        </Card>
        
        {/* Anotações */}
        <Card>
          <CardHeader>
            <CardTitle>Anotações</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea 
              value={notes} 
              onChange={handleNotesChange} 
              placeholder="Adicione anotações sobre a ordem de serviço..." 
              className="mb-4"
            />
            <Button onClick={handleSaveNotes} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Anotações
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Separator className="my-6" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Adicionar Fotos */}
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Fotos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="photo">Foto</Label>
              <Input type="file" id="photo" accept="image/*" onChange={handlePhotoChange} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea 
                id="description"
                placeholder="Adicione uma descrição para a foto..."
                value={photoDescription}
                onChange={(e) => setPhotoDescription(e.target.value)}
              />
            </div>
            
            <Button onClick={handleAddPhoto} disabled={addPhotoMutation.isPending || !photoFile}>
              {addPhotoMutation.isPending ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Adicionando...
                </>
              ) : (
                <>
                  <ImagePlus className="mr-2 h-4 w-4" />
                  Adicionar Foto
                </>
              )}
            </Button>
          </CardContent>
        </Card>
        
        {/* Assinatura */}
        <Card>
          <CardHeader>
            <CardTitle>Assinatura do Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <SignaturePad 
                options={{ 
                  minWidth: 1, 
                  maxWidth: 3, 
                  penColor: "rgb(66, 153, 225)",
                  height: "200px",
                  width: "100%"
                }}
                ref={(ref) => setSignaturePad(ref)}
              />
            </div>
            <Button 
              onClick={handleSaveSignature} 
              disabled={saveSignatureMutation.isPending || isSavingSignature}
              className="mt-4"
            >
              {saveSignatureMutation.isPending || isSavingSignature ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Salvando Assinatura...
                </>
              ) : (
                <>
                  <Signature className="mr-2 h-4 w-4" />
                  Salvar Assinatura
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Galeria de Fotos */}
      {workOrder.photos && workOrder.photos.length > 0 && (
        <>
          <Separator className="my-6" />
          <Card>
            <CardHeader>
              <CardTitle>Fotos da Ordem de Serviço</CardTitle>
            </CardHeader>
            <CardContent>
              <PhotoGrid photos={workOrder.photos} refetch={refetch} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default WorkOrderView;
