
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCompanyDetails } from '@/services/companyService';
import { Loader2, User, Star, Calendar, BarChart, Briefcase } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCurrentTechnician } from '@/services/technician/technicianAuth';

// Import our components
import TechnicianSettingsLayout from '@/components/technician/TechnicianSettingsLayout';
import CompanyCard from '@/components/technician/CompanyCard';
import UserInfoCard from '@/components/technician/UserInfoCard';
import AppInfoCard from '@/components/technician/AppInfoCard';
import TechnicianProfileSettings from '@/components/technician/TechnicianProfileSettings';
import TechnicianSkillsManager from '@/components/technician/TechnicianSkillsManager';
import TechnicianAvailabilityManager from '@/components/technician/TechnicianAvailability';
import TechnicianPerformanceDashboard from '@/components/technician/TechnicianPerformanceDashboard';
import TechnicianWorkHistory from '@/components/technician/TechnicianWorkHistory';

const TechnicianSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("geral");
  
  const { data: company, isLoading: isLoadingCompany } = useQuery({
    queryKey: ['companyDetails'],
    queryFn: getCompanyDetails,
  });

  const { data: technician, isLoading: isLoadingTechnician } = useQuery({
    queryKey: ['currentTechnician'],
    queryFn: getCurrentTechnician,
    enabled: !!user,
  });

  if (isLoadingCompany || isLoadingTechnician) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!technician) {
    return (
      <TechnicianSettingsLayout>
        <div className="col-span-full">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 text-yellow-800 dark:text-yellow-500 p-4 rounded-md">
            <h2 className="text-lg font-semibold mb-2">Acesso não autorizado</h2>
            <p>Você não está registrado como técnico no sistema ou sua conta não foi encontrada.</p>
          </div>
        </div>
      </TechnicianSettingsLayout>
    );
  }

  return (
    <TechnicianSettingsLayout>
      <div className="col-span-full">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full max-w-md mb-6 grid grid-cols-3 md:grid-cols-5">
            <TabsTrigger value="geral" className="flex gap-1">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Geral</span>
            </TabsTrigger>
            <TabsTrigger value="perfil" className="flex gap-1">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="habilidades" className="flex gap-1">
              <Star className="h-4 w-4" />
              <span className="hidden md:inline">Habilidades</span>
            </TabsTrigger>
            <TabsTrigger value="disponibilidade" className="flex gap-1">
              <Calendar className="h-4 w-4" />
              <span className="hidden md:inline">Disponibilidade</span>
            </TabsTrigger>
            <TabsTrigger value="desempenho" className="flex gap-1">
              <BarChart className="h-4 w-4" />
              <span className="hidden md:inline">Desempenho</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="geral" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <CompanyCard company={company} />
              <UserInfoCard userEmail={user?.email} />
              <AppInfoCard />
            </div>
          </TabsContent>
          
          <TabsContent value="perfil">
            <TechnicianProfileSettings technician={technician} />
          </TabsContent>
          
          <TabsContent value="habilidades">
            <TechnicianSkillsManager technician={technician} />
          </TabsContent>
          
          <TabsContent value="disponibilidade">
            <TechnicianAvailabilityManager technician={technician} />
          </TabsContent>
          
          <TabsContent value="desempenho" className="space-y-6">
            <TechnicianPerformanceDashboard technician={technician} />
            <TechnicianWorkHistory technician={technician} />
          </TabsContent>
        </Tabs>
      </div>
    </TechnicianSettingsLayout>
  );
};

export default TechnicianSettings;
