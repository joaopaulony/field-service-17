
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { UploadCloud, Camera, Loader, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { addWorkOrderPhoto } from '@/services/photoService';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { WorkOrder } from '@/types/workOrders';

interface PhotoUploadProps {
  workOrderId: string;
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<WorkOrder, Error>>;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ workOrderId, refetch }) => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile) throw new Error('Nenhum arquivo selecionado');
      return addWorkOrderPhoto(workOrderId, selectedFile, description);
    },
    onSuccess: () => {
      toast({
        title: "Foto adicionada",
        description: "A foto foi adicionada com sucesso."
      });
      resetForm();
      refetch();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao adicionar foto",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    uploadMutation.mutate();
  };

  const resetForm = () => {
    setSelectedFile(null);
    setDescription('');
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const cancelSelection = () => {
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!selectedFile ? (
        <Card className="border-dashed border-2 bg-muted/50">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Selecione uma imagem ou tire uma foto</p>
            
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              <Button
                type="button" 
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Selecionar arquivo
              </Button>
              
              <Button
                type="button"
                variant="outline" 
                size="sm"
                onClick={handleCameraCapture}
                className="flex items-center gap-2"
              >
                <Camera className="h-4 w-4" />
                <span>Usar câmera</span>
              </Button>
            </div>
            
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <img 
              src={previewUrl || ''} 
              alt="Preview" 
              className="w-full h-64 object-cover rounded-md"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={cancelSelection}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Adicione uma descrição para a foto..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={uploadMutation.isPending}
              className="flex items-center gap-2"
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="h-4 w-4" />
                  <span>Enviar Foto</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};

export default PhotoUpload;
