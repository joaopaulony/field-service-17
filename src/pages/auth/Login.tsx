
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clipboard, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getCurrentTechnician } from '@/services/technician/technicianAuth';

const Login = () => {
  const { toast } = useToast();
  const { signIn, user, loading } = useAuth();
  const [isCompany, setIsCompany] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkUserType = async () => {
      if (user) {
        setLoginLoading(true);
        try {
          // Check if the user is a technician
          const technician = await getCurrentTechnician();
          
          if (technician) {
            // Redirect to technician dashboard
            navigate('/technician');
          } else {
            // Redirect to company dashboard
            navigate('/dashboard');
          }
        } catch (error) {
          console.error("Error determining user type:", error);
          navigate('/dashboard'); // Default to company dashboard on error
        } finally {
          setLoginLoading(false);
        }
      }
    };
    
    checkUserType();
  }, [user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    
    try {
      await signIn(email, password);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoginLoading(false);
    }
  };
  
  if (loading || loginLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted p-4">
      <Link to="/" className="flex items-center gap-2 mb-8">
        <div className="bg-primary rounded-md p-1">
          <Clipboard size={20} className="text-white" />
        </div>
        <span className="font-semibold text-lg">FieldService</span>
      </Link>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Entrar</CardTitle>
          <CardDescription className="text-center">
            Entre com seu e-mail e senha para acessar sua conta
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex justify-center space-x-2 mb-6">
            <Button
              variant={isCompany ? "default" : "outline"}
              onClick={() => setIsCompany(true)}
              className="w-full"
            >
              Empresa
            </Button>
            <Button
              variant={!isCompany ? "default" : "outline"}
              onClick={() => setIsCompany(false)}
              className="w-full"
            >
              Técnico
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  placeholder="seuemail@exemplo.com" 
                  type="email" 
                  required
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  placeholder="••••••••" 
                  type="password" 
                  required
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            
            <Button className="w-full" type="submit" disabled={loading || loginLoading}>
              {loading || loginLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
        
        <Separator />
        
        <CardFooter className="flex justify-center p-6">
          <div className="text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Cadastre-se
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
