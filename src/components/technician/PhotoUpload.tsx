
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImagePlus, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addWorkOrderPhoto } from '@/services/photoService';

interface PhotoUploadProps {
  workOrderId: string;
  refetch: () => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ workOrderId, refetch }) => {
  const { toast } = useToast();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoDescription, setPhotoDescription] = useState('');

  const addPhotoMutation = useMutation({
    mutationFn: () => addWorkOrderPhoto(workOrderId, photoFile!, photoDescription),
    onSuccess: () => {
      toast({
        title: "Foto adicionada",
        description: "A foto foi adicionada à ordem de serviço."
      });
      setPhotoFile(null);
      setPhotoDescription('');
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

  return (
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
  );
};

export default PhotoUpload;
