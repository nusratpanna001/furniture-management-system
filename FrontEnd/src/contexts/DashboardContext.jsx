import { createContext, useContext, useState, useCallback } from 'react';

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerDashboardRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <DashboardContext.Provider value={{ refreshTrigger, triggerDashboardRefresh }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
}
