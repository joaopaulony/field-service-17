
import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useQuery } from "@tanstack/react-query";
import { getInventoryCategories } from "@/services/inventoryService";
import { InventoryCategory, InventoryItem } from "@/types/inventory";
import { Loader2 } from "lucide-react";

// Define form schema
const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  sku: z.string().optional(),
  category_id: z.string().optional().nullable(),
  description: z.string().optional(),
  unit_price: z.coerce.number().min(0, "Preço de venda deve ser maior ou igual a zero"),
  cost_price: z.coerce.number().min(0, "Preço de custo deve ser maior ou igual a zero"),
  quantity: z.coerce.number().int().min(0, "Quantidade deve ser maior ou igual a zero"),
  min_quantity: z.coerce.number().int().min(0, "Quantidade mínima deve ser maior ou igual a zero"),
  status: z.enum(["active", "discontinued", "low_stock"]).default("active"),
  is_discontinued: z.boolean().default(false), // Helper field for UI
});

type FormValues = z.infer<typeof formSchema>;

interface InventoryFormProps {
  initialData?: InventoryItem;
  onSubmit: (data: FormValues) => void;
  isSubmitting: boolean;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ initialData, onSubmit, isSubmitting }) => {
  // Fetch categories
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["inventoryCategories"],
    queryFn: getInventoryCategories,
  });

  const defaultValues = initialData ? {
    ...initialData,
    is_discontinued: initialData.status === "discontinued"
  } : {
    name: "",
    sku: "",
    category_id: null,
    description: "",
    unit_price: 0,
    cost_price: 0,
    quantity: 0,
    min_quantity: 0,
    status: "active" as const,
    is_discontinued: false
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const watchIsDiscontinued = form.watch('is_discontinued');

  // Update status when is_discontinued changes
  useEffect(() => {
    if (watchIsDiscontinued) {
      form.setValue('status', 'discontinued');
    } else {
      const quantity = form.getValues('quantity');
      const minQuantity = form.getValues('min_quantity');
      form.setValue('status', quantity <= minQuantity ? 'low_stock' : 'active');
    }
  }, [watchIsDiscontinued, form]);

  // Update status when quantity or min_quantity changes
  const handleQuantityChange = () => {
    if (!watchIsDiscontinued) {
      const quantity = form.getValues('quantity');
      const minQuantity = form.getValues('min_quantity');
      form.setValue('status', quantity <= minQuantity ? 'low_stock' : 'active');
    }
  };

  const handleFormSubmit = (data: FormValues) => {
    // Status is already set by effects
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome*</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nome do item" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* SKU */}
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Código único do item" />
                </FormControl>
                <FormDescription>
                  Código único para identificação do item (opcional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value?.toString() || ""}
                  value={field.value?.toString() || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Sem categoria</SelectItem>
                    {isLoadingCategories ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : (
                      categories.map((category: InventoryCategory) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Unit Price */}
          <FormField
            control={form.control}
            name="unit_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço de Venda*</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    {...field}
                    placeholder="0.00"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cost Price */}
          <FormField
            control={form.control}
            name="cost_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço de Custo*</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    {...field}
                    placeholder="0.00"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Quantity */}
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade em Estoque*</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    {...field}
                    placeholder="0"
                    onChange={(e) => {
                      field.onChange(e);
                      handleQuantityChange();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Min Quantity */}
          <FormField
            control={form.control}
            name="min_quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade Mínima*</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    {...field}
                    placeholder="0"
                    onChange={(e) => {
                      field.onChange(e);
                      handleQuantityChange();
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Alerta de estoque baixo quando abaixo deste valor
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Is Discontinued */}
          <FormField
            control={form.control}
            name="is_discontinued"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Descontinuado</FormLabel>
                  <FormDescription>
                    Marque esta opção se o item não está mais disponível
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Descrição detalhada do item"
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Atualizar" : "Criar"} Item
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InventoryForm;
