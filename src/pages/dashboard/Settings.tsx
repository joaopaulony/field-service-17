
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

const AppearanceSettings = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Aparência</h3>
      
      <RadioGroup value={theme} onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'tech')}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <RadioGroupItem id="light" value="light" className="sr-only peer" />
            <Label 
              htmlFor="light" 
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary"
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
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-gray-950 p-4 hover:bg-gray-900 hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary"
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
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-sky-50 p-4 hover:bg-sky-100 hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary"
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações da sua empresa e do aplicativo.
        </p>
      </div>
      
      <Tabs defaultValue="company">
        <TabsList className="w-full sm:w-auto grid grid-cols-3">
          <TabsTrigger value="company">Empresa</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
          <TabsTrigger value="account">Conta</TabsTrigger>
        </TabsList>
        
        <TabsContent value="company" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Empresa</CardTitle>
              <CardDescription>
                Atualize as informações da sua empresa.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <p>Carregando informações da empresa...</p>
              ) : company ? (
                <form onSubmit={handleUpdateCompany} className="space-y-4">
                  <LogoUpload
                    currentLogo={company.logo_url || ""}
                    onLogoUpdate={handleLogoUpdate}
                    companyName={company.name}
                  />
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome da Empresa</Label>
                      <Input
                        id="name"
                        name="name"
                        defaultValue={company.name}
                        placeholder="Nome da empresa"
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
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact_person">Pessoa de Contato</Label>
                      <Input
                        id="contact_person"
                        name="contact_person"
                        defaultValue={company.contact_person || ""}
                        placeholder="Pessoa de Contato"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      name="address"
                      defaultValue={company.address || ""}
                      placeholder="Endereço"
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
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        name="state"
                        defaultValue={company.state || ""}
                        placeholder="Estado"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip_code">CEP</Label>
                      <Input
                        id="zip_code"
                        name="zip_code"
                        defaultValue={company.zip_code || ""}
                        placeholder="CEP"
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? "Atualizando..." : "Atualizar Empresa"}
                  </Button>
                </form>
              ) : (
                <p>Erro ao carregar informações da empresa.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
              <CardDescription>
                Personalize a aparência do aplicativo de acordo com suas preferências.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AppearanceSettings />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Conta</CardTitle>
              <CardDescription>
                Gerencie as configurações da sua conta de usuário.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Account settings content would go here */}
              <p>Configurações de conta em breve.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
