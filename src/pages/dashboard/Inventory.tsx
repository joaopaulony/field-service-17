import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getInventoryItems,
  getInventorySummary,
  deleteInventoryItem,
  createInventoryMovement,
  exportInventoryToExcel,
  exportInventoryToPDF,
} from "@/services/inventoryService";
import InventoryCard from "@/components/inventory/InventoryCard";
import InventoryTable from "@/components/inventory/InventoryTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader2, FileSpreadsheet, FileText } from "lucide-react";
import { InventoryItemWithCategory } from "@/types/inventory";
import PlanFeatureAlert from "@/components/PlanFeatureAlert";

const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Queries
  const {
    data: inventoryItems = [],
    isLoading: isLoadingItems,
  } = useQuery({
    queryKey: ["inventoryItems"],
    queryFn: getInventoryItems,
  });

  const {
    data: inventorySummary,
    isLoading: isLoadingSummary,
  } = useQuery({
    queryKey: ["inventorySummary"],
    queryFn: getInventorySummary,
  });

  // State for dialogs
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItemWithCategory | null>(null);
  const [stockAdjustment, setStockAdjustment] = useState(0);
  const [stockMovementType, setStockMovementType] = useState<"in" | "out">("in");
  const [isSubmittingMovement, setIsSubmittingMovement] = useState(false);
  const [showPlanAlert, setShowPlanAlert] = useState(false);

  // Mutations
  const deleteItemMutation = useMutation({
    mutationFn: (id: string) => deleteInventoryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventoryItems"] });
      queryClient.invalidateQueries({ queryKey: ["inventorySummary"] });
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
    },
  });

  const stockMovementMutation = useMutation({
    mutationFn: (values: { itemId: string; quantity: number; type: "in" | "out" }) => {
      return createInventoryMovement({
        item_id: values.itemId,
        quantity: values.quantity,
        movement_type: values.type,
        notes: `Ajuste manual de estoque (${values.type === "in" ? "entrada" : "saída"})`,
        company_id: selectedItem?.company_id || ""
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventoryItems"] });
      queryClient.invalidateQueries({ queryKey: ["inventorySummary"] });
      setIsStockDialogOpen(false);
      setSelectedItem(null);
      setStockAdjustment(0);
    },
  });

  // Handlers
  const handleEditItem = (item: InventoryItemWithCategory) => {
    navigate(`/dashboard/inventory/${item.id}`);
  };

  const handleDeleteItem = (item: InventoryItemWithCategory) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteItem = () => {
    if (selectedItem) {
      deleteItemMutation.mutate(selectedItem.id);
    }
  };

  const handleAdjustStock = (item: InventoryItemWithCategory, type: "in" | "out") => {
    setSelectedItem(item);
    setStockMovementType(type);
    setIsStockDialogOpen(true);
  };

  const confirmStockMovement = async () => {
    if (!selectedItem || stockAdjustment <= 0) {
      toast({
        title: "Quantidade inválida",
        description: "Por favor, insira uma quantidade válida maior que zero.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingMovement(true);
    try {
      await stockMovementMutation.mutateAsync({
        itemId: selectedItem.id,
        quantity: stockAdjustment,
        type: stockMovementType,
      });
    } catch (error) {
      console.error("Failed to adjust stock:", error);
    } finally {
      setIsSubmittingMovement(false);
    }
  };

  const handleExportExcel = () => {
    // Check if this is a premium feature
    // For now, we'll assume it's available to all plans
    exportInventoryToExcel(inventoryItems);
  };

  const handleExportPDF = () => {
    // Check if this is a premium feature
    // For now, we'll assume it's available to all plans
    exportInventoryToPDF(inventoryItems);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Estoque</h2>
          <p className="text-muted-foreground">
            Gerenciamento de estoque e produtos
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportExcel}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <FileText className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Button onClick={() => navigate("/dashboard/inventory/new")}>
            Novo Item
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      {isLoadingSummary ? (
        <div className="flex items-center justify-center h-32 bg-muted rounded-md">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        inventorySummary && <InventoryCard summary={inventorySummary} />
      )}

      {/* Inventory Table */}
      {isLoadingItems ? (
        <div className="flex items-center justify-center h-64 bg-muted rounded-md">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <InventoryTable
          items={inventoryItems}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
          onAdjustStock={handleAdjustStock}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o item "
              {selectedItem?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteItem}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteItemMutation.isPending}
            >
              {deleteItemMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Stock Adjustment Dialog */}
      <Dialog open={isStockDialogOpen} onOpenChange={setIsStockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {stockMovementType === "in" ? "Adicionar ao" : "Remover do"}{" "}
              Estoque
            </DialogTitle>
            <DialogDescription>
              {stockMovementType === "in"
                ? "Adicione a quantidade de itens a incluir no estoque."
                : "Informe a quantidade de itens a retirar do estoque."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <p className="font-medium">{selectedItem?.name}</p>
              <p className="text-sm text-muted-foreground">
                Estoque atual: {selectedItem?.quantity} unidades
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={stockAdjustment}
                onChange={(e) => setStockAdjustment(parseInt(e.target.value) || 0)}
                placeholder="Quantidade"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStockDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmStockMovement}
              disabled={stockAdjustment <= 0 || isSubmittingMovement}
            >
              {isSubmittingMovement && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Plan Feature Alert */}
      {showPlanAlert && (
        <PlanFeatureAlert
          title="Funcionalidade Premium"
          description="Atualize seu plano para acessar todos os recursos de gerenciamento de estoque."
          showUpgradeButton={true}
        />
      )}
    </div>
  );
};

export default Inventory;
