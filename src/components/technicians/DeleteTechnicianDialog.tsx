
import React from 'react';
import { Technician } from '@/types/workOrders';
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';

interface DeleteTechnicianDialogProps {
  technician: Technician | null;
  isPending: boolean;
  onDelete: () => void;
}

const DeleteTechnicianDialog: React.FC<DeleteTechnicianDialogProps> = ({
  technician,
  isPending,
  onDelete
}) => {
  // Handler to prevent auto-close when confirming deletion
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    onDelete();
    // Dialog will be closed by the parent component after operation completes
  };
  
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
        <AlertDialogDescription>
          Esta ação não pode ser desfeita. Isso excluirá permanentemente o técnico
          <strong> {technician?.name}</strong> e removerá suas informações do sistema.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
        <AlertDialogAction 
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Excluindo...</span>
            </>
          ) : "Excluir Técnico"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default DeleteTechnicianDialog;
