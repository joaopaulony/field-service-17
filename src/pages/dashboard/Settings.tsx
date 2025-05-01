
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { getCompanyDetails, updateCompany, uploadCompanyLogo } from "@/services/companyService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import LogoUpload from "@/components/settings/LogoUpload";
import { Building, Palette, User } from "lucide-react";

const AppearanceSettings = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-medium">Aparência</h3>
      </div>
      
      <RadioGroup value={theme} onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'tech')}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <RadioGroupItem id="light" value="light" className="sr-only peer" />
            <Label 
              htmlFor="light" 
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary transition-colors"
            >
              <div className="w-full mb-4">
                <div className="rounded-md border border-gray-200 bg-gray-50 p-2 mb-2">
                  <div className="h-2 w-24 rounded-lg bg-gray-300" />
                </div>
                <div className="h-8 w-8 rounded-full bg-blue-500 mx-auto" />
              </div>
              <span className="text-sm font-medium">Claro</span>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem id="dark" value="dark" className="sr-only peer" />
            <Label 
              htmlFor="dark" 
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-gray-950 p-4 hover:bg-gray-900 hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary transition-colors"
            >
              <div className="w-full mb-4">
                <div className="rounded-md border border-gray-700 bg-gray-800 p-2 mb-2">
                  <div className="h-2 w-24 rounded-lg bg-gray-600" />
                </div>
                <div className="h-8 w-8 rounded-full bg-blue-500 mx-auto" />
              </div>
              <span className="text-sm font-medium text-white">Escuro</span>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem id="tech" value="tech" className="sr-only peer" />
            <Label 
              htmlFor="tech" 
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-sky-50 p-4 hover:bg-sky-100 hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary transition-colors"
            >
              <div className="w-full mb-4">
                <div className="rounded-md border border-cyan-200 bg-white p-2 mb-2">
                  <div className="h-2 w-24 rounded-lg bg-cyan-300" />
                </div>
                <div className="h-8 w-8 rounded-full bg-cyan-500 mx-auto" />
              </div>
              <span className="text-sm font-medium">Técnico</span>
            </Label>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

const Settings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: company, isLoading } = useQuery({
    queryKey: ["company"],
    queryFn: getCompanyDetails,
  });

  const updateMutation = useMutation({
    mutationFn: (updates: any) => updateCompany(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company"] });
      toast({
        title: "Empresa atualizada",
        description: "As informações da empresa foram atualizadas com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar empresa",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleUpdateCompany = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!company) return;

    const formData = new FormData(e.currentTarget);
    const updates = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      zip_code: formData.get("zip_code") as string,
      contact_person: formData.get("contact_person") as string,
    };

    updateMutation.mutate(updates);
  };

  const handleLogoUpdate = (url: string) => {
    if (!company) return;
    updateMutation.mutate({ logo_url: url });
  };
  
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações da sua empresa e do aplicativo.
        </p>
      </div>
      
      <Tabs defaultValue="company" className="w-full">
        <TabsList className="w-full sm:w-auto grid grid-cols-3 mb-6 max-w-md">
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span>Empresa</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span>Aparência</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Conta</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="company" className="mt-0">
          <Card className="shadow-md border-muted">
            <CardHeader className="bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-900/30 dark:to-gray-900/40">
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-muted-foreground" />
                Informações da Empresa
              </CardTitle>
              <CardDescription>
                Atualize as informações da sua empresa.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {isLoading ? (
                <p>Carregando informações da empresa...</p>
              ) : company ? (
                <form onSubmit={handleUpdateCompany} className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <LogoUpload
                      currentLogo={company.logo_url || ""}
                      onLogoUpdate={handleLogoUpdate}
                      companyName={company.name}
                    />
                    <div className="w-full space-y-6">
                      <Separator className="md:hidden" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Nome da Empresa</Label>
                          <Input
                            id="name"
                            name="name"
                            defaultValue={company.name}
                            placeholder="Nome da empresa"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={company.email || ""}
                            placeholder="Email"
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Telefone</Label>
                          <Input
                            id="phone"
                            name="phone"
                            defaultValue={company.phone || ""}
                            placeholder="Telefone"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="contact_person">Pessoa de Contato</Label>
                          <Input
                            id="contact_person"
                            name="contact_person"
                            defaultValue={company.contact_person || ""}
                            placeholder="Pessoa de Contato"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Endereço</Label>
                      <Input
                        id="address"
                        name="address"
                        defaultValue={company.address || ""}
                        placeholder="Endereço"
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">Cidade</Label>
                        <Input
                          id="city"
                          name="city"
                          defaultValue={company.city || ""}
                          placeholder="Cidade"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">Estado</Label>
                        <Input
                          id="state"
                          name="state"
                          defaultValue={company.state || ""}
                          placeholder="Estado"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="zip_code">CEP</Label>
                        <Input
                          id="zip_code"
                          name="zip_code"
                          defaultValue={company.zip_code || ""}
                          placeholder="CEP"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={updateMutation.isPending} className="px-6">
                      {updateMutation.isPending ? "Atualizando..." : "Atualizar Empresa"}
                    </Button>
                  </div>
                </form>
              ) : (
                <p>Erro ao carregar informações da empresa.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="mt-0">
          <Card className="shadow-md border-muted">
            <CardHeader className="bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-900/30 dark:to-gray-900/40">
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-muted-foreground" />
                Aparência
              </CardTitle>
              <CardDescription>
                Personalize a aparência do aplicativo de acordo com suas preferências.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <AppearanceSettings />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="mt-0">
          <Card className="shadow-md border-muted">
            <CardHeader className="bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-900/30 dark:to-gray-900/40">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                Conta
              </CardTitle>
              <CardDescription>
                Gerencie as configurações da sua conta de usuário.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {/* Account settings content would go here */}
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <User className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Configurações de conta em breve.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
