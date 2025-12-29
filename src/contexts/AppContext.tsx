import React, { createContext, useContext, useState, ReactNode } from 'react';
import { roles, verticals, Role } from '@/lib/mockData';

interface AppContextType {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  currentVertical: typeof verticals[number];
  setCurrentVertical: (vertical: typeof verticals[number]) => void;
  dateRange: { from: Date; to: Date };
  setDateRange: (range: { from: Date; to: Date }) => void;
  reducedOperationsMode: boolean;
  setReducedOperationsMode: (mode: boolean) => void;
  canAccessModule: (module: string) => boolean;
  isRestrictedRole: () => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<Role>(roles[0]);
  const [currentVertical, setCurrentVertical] = useState(verticals[0]);
  const [dateRange, setDateRange] = useState({
    from: new Date(2024, 0, 1),
    to: new Date(2024, 0, 16),
  });
  const [reducedOperationsMode, setReducedOperationsMode] = useState(false);

  const canAccessModule = (module: string): boolean => {
    if (currentRole.id === 'super-admin') return true;
    
    const permissions = {
      'super-admin': ['*'],
      'vertical-admin': ['dashboard', 'multi-vertical', 'users', 'contacts', 'donations', 'fees', 'volunteers', 'procurement', 'hr', 'programs', 'events', 'exceptions', 'messaging', 'reports'],
      'finance': ['dashboard', 'donations', 'fees', 'procurement', 'reports', 'audit'],
      'hr': ['dashboard', 'users', 'volunteers', 'hr'],
      'procurement': ['dashboard', 'procurement'],
      'programs-mel': ['dashboard', 'programs', 'reports'],
      'safeguarding': ['dashboard', 'safeguarding'],
      'donor': ['dashboard', 'donations', 'reports'],
      'parent': ['dashboard', 'fees'],
      'volunteer': ['dashboard', 'volunteers'],
      'vendor': ['dashboard', 'procurement'],
      'auditor': ['dashboard', 'audit', 'reports', 'exceptions', 'multi-vertical'],
    };

    const rolePermissions = permissions[currentRole.id as keyof typeof permissions] || [];
    return rolePermissions.includes('*') || rolePermissions.includes(module);
  };

  const isRestrictedRole = (): boolean => {
    return currentRole.id === 'super-admin' || currentRole.id === 'safeguarding';
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentVertical,
        setCurrentVertical,
        dateRange,
        setDateRange,
        reducedOperationsMode,
        setReducedOperationsMode,
        canAccessModule,
        isRestrictedRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
