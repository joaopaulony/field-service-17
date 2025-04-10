
import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { deleteWorkOrderPhoto } from '@/services/photoService';
import { WorkOrderPhoto } from '@/types/workOrders';

interface PhotoGridProps {
  photos: WorkOrderPhoto[];
  refetch: () => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, refetch }) => {
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: (photoId: string) => deleteWorkOrderPhoto(photoId),
    onSuccess: () => {
      toast({
        title: "Foto removida",
        description: "A foto foi removida com sucesso."
      });
      refetch();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao remover foto",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleDeletePhoto = (photoId: string) => {
    if (confirm("Tem certeza que deseja remover esta foto?")) {
      deleteMutation.mutate(photoId);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {photos.map((photo) => (
        <Card key={photo.id} className="overflow-hidden relative group">
          <img 
            src={photo.photo_url} 
            alt={photo.description || "Foto da ordem de serviço"} 
            className="w-full h-48 object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleDeletePhoto(photo.id)}
          >
            <X className="h-4 w-4" />
          </Button>
          {photo.description && (
            <div className="p-3 bg-background/80 absolute bottom-0 w-full">
              <p className="text-sm truncate">{photo.description}</p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default PhotoGrid;
