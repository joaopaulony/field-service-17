
import React from 'react';

interface TechnicianSettingsLayoutProps {
  children: React.ReactNode;
}

const TechnicianSettingsLayout: React.FC<TechnicianSettingsLayoutProps> = ({ children }) => {
  return (
    <div className="container px-4 py-6 mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold tracking-tight mb-8">Configurações</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {children}
      </div>
    </div>
  );
};

export default TechnicianSettingsLayout;
