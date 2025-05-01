
import React from 'react';

interface TechnicianSettingsLayoutProps {
  children: React.ReactNode;
}

const TechnicianSettingsLayout: React.FC<TechnicianSettingsLayoutProps> = ({ children }) => {
  return (
    <div className="container px-4 py-6 mx-auto max-w-md">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Configurações</h1>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

export default TechnicianSettingsLayout;
