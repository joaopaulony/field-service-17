
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Clipboard, 
  CheckCircle2, 
  Users, 
  LineChart, 
  Camera,
  MapPin,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary rounded-md p-1">
              <Clipboard size={20} className="text-white" />
            </div>
            <span className="font-semibold text-lg">FieldService</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium hover:text-primary">
              Entrar
            </Link>
            <Button asChild>
              <Link to="/register">Começar Grátis</Link>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Gerencie sua equipe de campo com eficiência
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Crie ordens de serviço, acompanhe o progresso e receba atualizações em tempo real dos técnicos em campo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/register">Começar Gratuitamente</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Acessar Painel</Link>
              </Button>
            </div>
          </div>
          
          <div className="bg-muted rounded-xl overflow-hidden shadow-lg">
            <img 
              src="/lovable-uploads/b610e546-2457-40d5-b85c-922302776454.png" 
              alt="Dashboard Preview" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4 bg-muted">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Tudo o que você precisa para gerenciar sua equipe externa</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ferramentas poderosas para empresas de todos os tamanhos, do pequeno negócio à grande corporação.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-background rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                <Clipboard size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ordens de Serviço</h3>
              <p className="text-muted-foreground">
                Crie e acompanhe ordens de serviço com detalhes completos, fotos e geolocalização.
              </p>
            </div>
            
            <div className="bg-background rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gestão de Técnicos</h3>
              <p className="text-muted-foreground">
                Cadastre técnicos, atribua tarefas e acompanhe o progresso de cada profissional.
              </p>
            </div>
            
            <div className="bg-background rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Checklists</h3>
              <p className="text-muted-foreground">
                Crie checklists personalizados para garantir que todos os procedimentos sejam seguidos.
              </p>
            </div>
            
            <div className="bg-background rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                <Camera size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fotos e Evidências</h3>
              <p className="text-muted-foreground">
                Registre o antes e depois com fotos, garantindo documentação completa do serviço.
              </p>
            </div>
            
            <div className="bg-background rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Geolocalização</h3>
              <p className="text-muted-foreground">
                Confirme a presença do técnico no local com registro automático de localização.
              </p>
            </div>
            
            <div className="bg-background rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Relatórios</h3>
              <p className="text-muted-foreground">
                Exporte relatórios detalhados em PDF, CSV ou Excel para análise e documentação.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Planos para todos os tamanhos de equipe</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Escolha o plano ideal para sua empresa e comece a otimizar o trabalho em campo.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-background border border-border rounded-lg p-6 shadow-sm">
              <div className="text-center pb-4">
                <h3 className="text-xl font-semibold">Gratuito</h3>
                <div className="mt-4 mb-2">
                  <span className="text-3xl font-bold">R$0</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <p className="text-sm text-muted-foreground">Para começar</p>
              </div>
              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex items-center">
                  <CheckCircle2 size={16} className="text-primary mr-2" />
                  <span className="text-sm">Até 2 técnicos</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 size={16} className="text-primary mr-2" />
                  <span className="text-sm">10 ordens de serviço/mês</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 size={16} className="text-primary mr-2" />
                  <span className="text-sm">Recursos básicos</span>
                </div>
              </div>
              <div className="mt-6">
                <Button className="w-full" variant="outline" asChild>
                  <Link to="/register">Começar Grátis</Link>
                </Button>
              </div>
            </div>
            
            <div className="bg-background border border-border rounded-lg p-6 shadow-sm">
              <div className="text-center pb-4">
                <h3 className="text-xl font-semibold">Básico</h3>
                <div className="mt-4 mb-2">
                  <span className="text-3xl font-bold">R$99</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <p className="text-sm text-muted-foreground">Para pequenas equipes</p>
              </div>
              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex items-center">
                  <CheckCircle2 size={16} className="text-primary mr-2" />
                  <span className="text-sm">Até 5 técnicos</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 size={16} className="text-primary mr-2" />
                  <span className="text-sm">100 ordens de serviço/mês</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 size={16} className="text-primary mr-2" />
                  <span className="text-sm">Checklists e fotos</span>
                </div>
              </div>
              <div className="mt-6">
                <Button className="w-full" asChild>
                  <Link to="/register">Escolher Plano</Link>
                </Button>
              </div>
            </div>
            
            <div className="bg-primary/5 border-2 border-primary rounded-lg p-6 shadow-md relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs py-1 px-3 rounded-full">
                Mais Popular
              </div>
              <div className="text-center pb-4">
                <h3 className="text-xl font-semibold">Profissional</h3>
                <div className="mt-4 mb-2">
                  <span className="text-3xl font-bold">R$199</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <p className="text-sm text-muted-foreground">Para equipes em crescimento</p>
              </div>
              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex items-center">
                  <CheckCircle2 size={16} className="text-primary mr-2" />
                  <span className="text-sm">Até 15 técnicos</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 size={16} className="text-primary mr-2" />
                  <span className="text-sm">500 ordens de serviço/mês</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 size={16} className="text-primary mr-2" />
                  <span className="text-sm">Relatórios avançados</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 size={16} className="text-primary mr-2" />
                  <span className="text-sm">Exportação de dados</span>
                </div>
              </div>
              <div className="mt-6">
                <Button className="w-full" asChild>
                  <Link to="/register">Escolher Plano</Link>
                </Button>
              </div>
            </div>
            
            <div className="bg-background border border-border rounded-lg p-6 shadow-sm">
              <div className="text-center pb-4">
                <h3 className="text-xl font-semibold">Empresarial</h3>
                <div className="mt-4 mb-2">
                  <span className="text-3xl font-bold">R$399</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <p className="text-sm text-muted-foreground">Para grandes equipes</p>
              </div>
              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex items-center">
                  <CheckCircle2 size={16} className="text-primary mr-2" />
                  <span className="text-sm">Técnicos ilimitados</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 size={16} className="text-primary mr-2" />
                  <span className="text-sm">OS ilimitadas</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 size={16} className="text-primary mr-2" />
                  <span className="text-sm">API e integrações</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 size={16} className="text-primary mr-2" />
                  <span className="text-sm">Suporte prioritário</span>
                </div>
              </div>
              <div className="mt-6">
                <Button className="w-full" variant="outline" asChild>
                  <Link to="/register">Escolher Plano</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/10">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para otimizar sua operação em campo?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Comece gratuitamente e veja como o FieldService pode transformar a gestão da sua equipe externa.
          </p>
          <Button size="lg" asChild>
            <Link to="/register">Começar Agora</Link>
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-muted py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="bg-primary rounded-md p-1">
                  <Clipboard size={20} className="text-white" />
                </div>
                <span className="font-semibold text-lg">FieldService</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Solução completa para gestão de equipes em campo.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-primary">Visão Geral</Link></li>
                <li><Link to="/" className="hover:text-primary">Funcionalidades</Link></li>
                <li><Link to="/" className="hover:text-primary">Preços</Link></li>
                <li><Link to="/" className="hover:text-primary">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-primary">Sobre Nós</Link></li>
                <li><Link to="/" className="hover:text-primary">Blog</Link></li>
                <li><Link to="/" className="hover:text-primary">Contato</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-primary">Termos de Serviço</Link></li>
                <li><Link to="/" className="hover:text-primary">Privacidade</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} FieldService. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
