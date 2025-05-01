
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCompanyDetails, updateCompany, UpdateCompanyDTO } from "@/services/companyService";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import LogoUpload from "@/components/settings/LogoUpload";
import PlanInfoBadge from "@/components/PlanInfoBadge";
import { Loader2 } from "lucide-react";
import { usePlan } from "@/contexts/PlanContext";

const formSchema = z.object({
  name: z.string().min(2, { message: "Nome da empresa deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }).optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  contact_person: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  state: z.string().optional().or(z.literal('')),
  zip_code: z.string().optional().or(z.literal('')),
  logo_url: z.string().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

const Settings = () => {
  const queryClient = useQueryClient();
  const { plan, limits } = usePlan();

  const { data: company, isLoading } = useQuery({
    queryKey: ['companyDetails'],
    queryFn: getCompanyDetails,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      contact_person: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      logo_url: '',
    },
  });

  React.useEffect(() => {
    if (company) {
      form.reset({
        name: company.name || '',
        email: company.email || '',
        phone: company.phone || '',
        contact_person: company.contact_person || '',
        address: company.address || '',
        city: company.city || '',
        state: company.state || '',
        zip_code: company.zip_code || '',
        logo_url: company.logo_url || '',
      });
    }
  }, [company, form]);

  const updateMutation = useMutation({
    mutationFn: (data: UpdateCompanyDTO) => updateCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyDetails'] });
    }
  });

  const onSubmit = (data: FormValues) => {
    updateMutation.mutate(data);
  };

  const handleLogoUpdate = (logoUrl: string) => {
    form.setValue('logo_url', logoUrl);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Map plan types to display names
  const planDisplayNames: Record<string, { name: string, description: string }> = {
    'free': { name: 'Gratuito', description: 'Plano básico com recursos limitados' },
    'basic': { name: 'Básico', description: 'Mais técnicos e ordens ilimitadas' },
    'professional': { name: 'Profissional', description: 'Recursos avançados e mais técnicos' },
    'enterprise': { name: 'Empresarial', description: 'Recursos completos e suporte dedicado' }
  };

  const currentPlanDisplay = planDisplayNames[plan] || 
    { name: 'Gratuito', description: 'Plano básico com recursos limitados' };

  return (
    <div className="container max-w-4xl py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações da sua empresa
          </p>
        </div>
        <PlanInfoBadge className="mt-2 md:mt-0" />
      </div>
      
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Empresa</CardTitle>
                <CardDescription>
                  Informações básicas sobre sua empresa
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da empresa</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome da empresa" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Email" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input placeholder="Telefone" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="contact_person"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Pessoa de contato</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome do responsável" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex flex-col items-center justify-start">
                    <FormField
                      control={form.control}
                      name="logo_url"
                      render={({ field }) => (
                        <FormItem>
                          <LogoUpload 
                            currentLogo={field.value} 
                            onLogoUpdate={handleLogoUpdate}
                            companyName={form.getValues('name')}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Endereço</CardTitle>
                <CardDescription>
                  Informações de localização da sua empresa
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Endereço" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input placeholder="Cidade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Input placeholder="Estado" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="zip_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                          <Input placeholder="CEP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Plano</CardTitle>
                <CardDescription>
                  Informações sobre o seu plano atual
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">
                      Plano atual: <span className="font-semibold text-primary">{currentPlanDisplay.name}</span>
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      {currentPlanDisplay.description}
                    </p>
                  </div>
                  
                  <Button variant="outline">
                    Atualizar plano
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={updateMutation.isPending}
                className="w-full sm:w-auto"
              >
                {updateMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Salvar alterações
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Settings;
