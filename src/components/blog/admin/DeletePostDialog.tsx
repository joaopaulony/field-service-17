
import React from 'react';
import { BlogPost } from '@/types/blog';
import { Loader2 } from 'lucide-react';
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeletePostDialogProps {
  post: BlogPost | null;
  isOpen: boolean;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

const DeletePostDialog: React.FC<DeletePostDialogProps> = ({
  post,
  isOpen,
  isDeleting,
  onOpenChange,
  onConfirm,
}) => {
  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    await onConfirm();
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
        <AlertDialogDescription>
          Esta ação não pode ser desfeita. Isso excluirá permanentemente o post{' '}
          <strong>"{post?.titulo}"</strong> e todos os seus dados.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
        <AlertDialogAction
          onClick={handleConfirm}
          className="bg-red-600 hover:bg-red-700"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Excluindo...</span>
            </>
          ) : (
            "Excluir"
          )}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default DeletePostDialog;
