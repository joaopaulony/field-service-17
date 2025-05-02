
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getInventoryItems } from '@/services/inventoryService';
import { InventoryItemWithCategory } from '@/types/inventory';
import { QuoteItemWithDetails, Quote } from '@/types/quotes';
import { Switch } from "@/components/ui/switch";

// Define form schema
const formSchema = z.object({
  client_name: z.string().min(1, "Nome do cliente é obrigatório"),
  client_email: z.string().email("Email inválido").optional().or(z.literal('')),
  client_phone: z.string().optional(),
  address: z.string().optional(),
  valid_until: z.date().optional(),
  notes: z.string().optional(),
  status: z.enum(["draft", "sent", "approved", "rejected", "expired"]).default("draft"),
});

type FormValues = z.infer<typeof formSchema>;

// Schema for quote items
const quoteItemSchema = z.object({
  inventory_item_id: z.string().optional(),
  description: z.string().min(1, "Descrição é obrigatória"),
  quantity: z.coerce.number().int().positive("Quantidade deve ser maior que zero"),
  unit_price: z.coerce.number().positive("Preço deve ser maior que zero"),
  discount_percentage: z.coerce.number().min(0).max(100).optional(),
});

type QuoteItemFormValues = z.infer<typeof quoteItemSchema>;

interface QuoteFormProps {
  initialData?: Quote;
  initialItems?: QuoteItemWithDetails[];
  onSubmit: (data: FormValues, items: QuoteItemFormValues[]) => void;
  isSubmitting: boolean;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ initialData, initialItems = [], onSubmit, isSubmitting }) => {
  const [quoteItems, setQuoteItems] = useState<QuoteItemFormValues[]>(initialItems.map(item => ({
    inventory_item_id: item.inventory_item_id || undefined,
    description: item.description,
    quantity: item.quantity,
    unit_price: item.unit_price,
    discount_percentage: item.discount_percentage || undefined,
  })));
  
  const [itemEditing, setItemEditing] = useState<QuoteItemFormValues | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [useCustomProduct, setUseCustomProduct] = useState(false);

  // Fetch inventory items
  const { data: inventoryItems = [], isLoading: isLoadingItems } = useQuery({
    queryKey: ["inventoryItems"],
    queryFn: getInventoryItems,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      valid_until: initialData.valid_until ? new Date(initialData.valid_until) : undefined,
    } : {
      client_name: "",
      client_email: "",
      client_phone: "",
      address: "",
      notes: "",
      status: "draft" as const,
    },
  });

  const itemForm = useForm<QuoteItemFormValues>({
    resolver: zodResolver(quoteItemSchema),
    defaultValues: {
      description: "",
      quantity: 1,
      unit_price: 0,
      discount_percentage: 0,
    },
  });

  const handleFormSubmit = (data: FormValues) => {
    onSubmit(data, quoteItems);
  };

  const handleAddItem = () => {
    setIsAddingItem(true);
    setItemEditing({
      description: "",
      quantity: 1,
      unit_price: 0,
      discount_percentage: 0,
    });
    setEditingIndex(null);
    setUseCustomProduct(false);
    
    itemForm.reset({
      inventory_item_id: undefined,
      description: "",
      quantity: 1,
      unit_price: 0,
      discount_percentage: 0,
    });
  };

  const handleEditItem = (item: QuoteItemFormValues, index: number) => {
    setIsAddingItem(true);
    setItemEditing(item);
    setEditingIndex(index);
    setUseCustomProduct(!item.inventory_item_id);
    itemForm.reset(item);
  };

  const handleRemoveItem = (index: number) => {
    setQuoteItems(quoteItems.filter((_, i) => i !== index));
  };

  const handleSaveItem = (data: QuoteItemFormValues) => {
    // If using custom product, remove the inventory_item_id
    const finalData = useCustomProduct ? { ...data, inventory_item_id: undefined } : data;
    
    if (editingIndex !== null) {
      // Edit existing item
      const newItems = [...quoteItems];
      newItems[editingIndex] = finalData;
      setQuoteItems(newItems);
    } else {
      // Add new item
      setQuoteItems([...quoteItems, finalData]);
    }
    setIsAddingItem(false);
    setItemEditing(null);
    setEditingIndex(null);
  };

  const handleToggleCustomProduct = (checked: boolean) => {
    setUseCustomProduct(checked);
    if (checked) {
      itemForm.setValue("inventory_item_id", undefined);
    }
  };

  const handleSelectInventoryItem = (itemId: string) => {
    const selectedItem = inventoryItems.find(item => item.id === itemId);
    if (selectedItem) {
      itemForm.setValue("description", selectedItem.name);
      itemForm.setValue("unit_price", selectedItem.unit_price);
    }
  };

  const calculateItemTotal = (item: QuoteItemFormValues) => {
    const discountMultiplier = item.discount_percentage 
      ? (1 - (item.discount_percentage / 100)) 
      : 1;
    return item.quantity * item.unit_price * discountMultiplier;
  };

  const calculateTotal = () => {
    return quoteItems.reduce(
      (total, item) => total + calculateItemTotal(item),
      0
    );
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Name */}
            <FormField
              control={form.control}
              name="client_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Cliente*</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome do cliente" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Client Email */}
            <FormField
              control={form.control}
              name="client_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Email do cliente" type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Client Phone */}
            <FormField
              control={form.control}
              name="client_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Telefone do cliente" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Endereço do cliente" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Valid Until */}
            <FormField
              control={form.control}
              name="valid_until"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Válido até</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Data de validade do orçamento
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="sent">Enviado</SelectItem>
                      <SelectItem value="approved">Aprovado</SelectItem>
                      <SelectItem value="rejected">Rejeitado</SelectItem>
                      <SelectItem value="expired">Expirado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Observações sobre o orçamento"
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Quote Items Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Itens do Orçamento</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddItem}
                disabled={isAddingItem}
              >
                <Plus className="h-4 w-4 mr-2" /> Adicionar Item
              </Button>
            </div>

            {/* Quote Items Table */}
            {quoteItems.length === 0 ? (
              <div className="text-center py-6 bg-muted/30 border rounded-md">
                <p className="text-muted-foreground">
                  Nenhum item adicionado. Clique em "Adicionar Item" para começar.
                </p>
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-2 text-left">Descrição</th>
                      <th className="px-4 py-2 text-right">Qtd</th>
                      <th className="px-4 py-2 text-right">Preço Unit.</th>
                      <th className="px-4 py-2 text-right">Desconto</th>
                      <th className="px-4 py-2 text-right">Total</th>
                      <th className="px-4 py-2 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quoteItems.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-3">
                          <div>
                            {item.description}
                            {!item.inventory_item_id && (
                              <span className="text-xs ml-2 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                Produto personalizado
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">{item.quantity}</td>
                        <td className="px-4 py-3 text-right">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unit_price)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {item.discount_percentage ? `${item.discount_percentage}%` : "-"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculateItemTotal(item))}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditItem(item, index)}
                              disabled={isAddingItem}
                            >
                              Editar
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(index)}
                              disabled={isAddingItem}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-muted/30">
                      <td colSpan={4} className="px-4 py-3 text-right font-medium">
                        Total do Orçamento:
                      </td>
                      <td className="px-4 py-3 text-right font-bold">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculateTotal())}
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Item Form */}
            {isAddingItem && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {editingIndex !== null ? "Editar" : "Adicionar"} Item
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 flex items-center space-x-2">
                    <Switch
                      id="custom-product"
                      checked={useCustomProduct}
                      onCheckedChange={handleToggleCustomProduct}
                    />
                    <label
                      htmlFor="custom-product"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Produto personalizado (fora do estoque)
                    </label>
                  </div>
                
                  <Form {...itemForm}>
                    <form
                      onSubmit={itemForm.handleSubmit(handleSaveItem)}
                      className="space-y-4"
                    >
                      {/* Inventory Item Selection - Only show if not custom product */}
                      {!useCustomProduct && (
                        <FormField
                          control={itemForm.control}
                          name="inventory_item_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Produto do Estoque</FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  handleSelectInventoryItem(value);
                                }}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione um produto" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {isLoadingItems ? (
                                    <div className="flex items-center justify-center p-2">
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    </div>
                                  ) : (
                                    inventoryItems.map((item: InventoryItemWithCategory) => (
                                      <SelectItem key={item.id} value={item.id}>
                                        {item.name} {item.sku ? `(${item.sku})` : ""}
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Selecionar um produto preencherá automaticamente os detalhes
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {/* Description */}
                      <FormField
                        control={itemForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descrição*</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Descrição do item" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Quantity */}
                        <FormField
                          control={itemForm.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantidade*</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  step="1"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Unit Price */}
                        <FormField
                          control={itemForm.control}
                          name="unit_price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preço Unitário*</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="0.01"
                                  step="0.01"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Discount */}
                        <FormField
                          control={itemForm.control}
                          name="discount_percentage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Desconto (%)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="1"
                                  {...field}
                                  value={field.value || ""}
                                  onChange={(e) => {
                                    const val = e.target.value ? Number(e.target.value) : undefined;
                                    field.onChange(val);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsAddingItem(false);
                            setItemEditing(null);
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button type="submit">
                          {editingIndex !== null ? "Atualizar" : "Adicionar"} Item
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || quoteItems.length === 0}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? "Atualizar" : "Criar"} Orçamento
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default QuoteForm;
