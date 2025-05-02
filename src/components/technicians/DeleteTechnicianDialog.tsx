
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
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction 
          onClick={onDelete}
          className="bg-red-600 hover:bg-red-700"
        >
          {isPending ? "Excluindo..." : "Excluir Técnico"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default DeleteTechnicianDialog;
