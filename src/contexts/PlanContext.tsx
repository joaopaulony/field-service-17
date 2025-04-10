
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCompanyPlan, getPlanLimits, PlanType, PlanLimits } from '@/services/planService';

interface PlanContextType {
  plan: PlanType;
  limits: PlanLimits | null;
  loading: boolean;
  refreshPlanInfo: () => Promise<void>;
}

const defaultPlanContext: PlanContextType = {
  plan: 'free',
  limits: null,
  loading: true,
  refreshPlanInfo: async () => {}
};

const PlanContext = createContext<PlanContextType>(defaultPlanContext);

export const usePlan = () => useContext(PlanContext);

export const PlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plan, setPlan] = useState<PlanType>('free');
  const [limits, setLimits] = useState<PlanLimits | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPlanInfo = async () => {
    try {
      setLoading(true);
      const currentPlan = await getCompanyPlan();
      setPlan(currentPlan);
      
      const currentLimits = await getPlanLimits();
      setLimits(currentLimits);
    } catch (error) {
      console.error('Error loading plan information:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadPlanInfo();
  }, []);

  const refreshPlanInfo = async () => {
    await loadPlanInfo();
  };

  return (
    <PlanContext.Provider value={{ plan, limits, loading, refreshPlanInfo }}>
      {children}
    </PlanContext.Provider>
  );
};
