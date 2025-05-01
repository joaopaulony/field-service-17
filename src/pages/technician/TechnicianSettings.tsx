
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCompanyDetails } from '@/services/companyService';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Import our new components
import TechnicianSettingsLayout from '@/components/technician/TechnicianSettingsLayout';
import CompanyCard from '@/components/technician/CompanyCard';
import UserInfoCard from '@/components/technician/UserInfoCard';
import AppInfoCard from '@/components/technician/AppInfoCard';

const TechnicianSettings = () => {
  const { user } = useAuth();
  
  const { data: company, isLoading } = useQuery({
    queryKey: ['companyDetails'],
    queryFn: getCompanyDetails,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <TechnicianSettingsLayout>
      <CompanyCard company={company} />
      <UserInfoCard userEmail={user?.email} />
      <AppInfoCard />
    </TechnicianSettingsLayout>
  );
};

export default TechnicianSettings;
