
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
} from "@/services/inventoryService";
import InventoryForm from "@/components/inventory/InventoryForm";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const InventoryItemForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id);

  // Fetch item details if editing
  const {
    data: inventoryItem,
    isLoading: isLoadingItem,
    isError,
  } = useQuery({
    queryKey: ["inventoryItem", id],
    queryFn: () => (id ? getInventoryItem(id) : null),
    enabled: isEditing,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventoryItems"] });
      queryClient.invalidateQueries({ queryKey: ["inventorySummary"] });
      navigate("/dashboard/inventory");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateInventoryItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventoryItems"] });
      queryClient.invalidateQueries({ queryKey: ["inventorySummary"] });
      queryClient.invalidateQueries({ queryKey: ["inventoryItem", id] });
      navigate("/dashboard/inventory");
    },
  });

  const handleSubmit = (data: any) => {
    // Remove helper field
    const { is_discontinued, ...formData } = data;
    
    if (isEditing && id) {
      updateMutation.mutate({ id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isEditing && isLoadingItem) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isEditing && isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-destructive">
          Erro ao carregar informações do item. Por favor, tente novamente.
        </p>
        <Button variant="outline" onClick={() => navigate("/dashboard/inventory")}>
          Voltar para Estoque
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dashboard/inventory")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">
          {isEditing ? "Editar" : "Novo"} Item
        </h2>
      </div>

      <div className="space-y-6">
        <InventoryForm
          initialData={inventoryItem || undefined}
          onSubmit={handleSubmit}
          isSubmitting={isEditing ? updateMutation.isPending : createMutation.isPending}
        />
      </div>
    </div>
  );
};

export default InventoryItemForm;
