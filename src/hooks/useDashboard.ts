import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';

// Types
export interface DashboardSummary {
  tier1_risks: Tier1Risk[];
  open_exceptions_count: number;
  compliance_score: number;
  staff_count: number;
  active_volunteers: number;
  total_donations_ytd: number;
  pending_approvals: number;
  safeguarding_cases?: number;
}

export interface Tier1Risk {
  id: string;
  title: string;
  vertical: string;
  vertical_id?: string;
  hours_remaining: number;
  severity: 'critical' | 'high' | 'medium';
}

export interface DashboardStats {
  tier1_risks: Tier1Risk[];
  open_exceptions: number;
  compliance_score: number;
  total_donations: number;
  pending_approvals: number;
  active_volunteers: number;
  staff_count: number;
  safeguarding_cases?: number;
  reduced_operations_mode?: boolean;
}

export interface VerticalHealthSummary {
  id: string;
  name: string;
  health_score: number;
  funding_status: 'adequate' | 'needs_attention' | 'critical';
  open_exceptions: number;
  staff_count: number;
  compliance_score: number;
}

export interface OpenException {
  id: string;
  type: string;
  description: string;
  status: string;
  escalation_level: number;
  vertical: string;
  vertical_id?: string;
  created_at: string;
}

export interface PendingApproval {
  type: string;
  count: number;
}

export interface DashboardFilters {
  vertical_id?: string;
  start_date?: string;
  end_date?: string;
}

// Query Keys
export const dashboardKeys = {
  all: ['dashboard'] as const,
  summary: () => [...dashboardKeys.all, 'summary'] as const,
  getSummary: (filters?: DashboardFilters) => [...dashboardKeys.summary(), filters] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  verticalHealth: () => [...dashboardKeys.all, 'vertical-health'] as const,
  openExceptions: () => [...dashboardKeys.all, 'open-exceptions'] as const,
};

// Hooks
export const useDashboardSummary = (filters?: DashboardFilters) => {
  return useQuery({
    queryKey: dashboardKeys.getSummary(filters),
    queryFn: async () => {
      const { data } = await apiClient.get<DashboardSummary>('/dashboard/summary', {
        params: filters,
      });
      return data;
    },
    staleTime: 30 * 1000, // 30 seconds for real-time data
    refetchInterval: 60000, // Refetch every minute
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: async () => {
      const { data } = await apiClient.get<DashboardStats>('/dashboard/stats');
      return data;
    },
    staleTime: 30 * 1000,
    refetchInterval: 60000,
  });
};

export const useVerticalHealth = () => {
  return useQuery({
    queryKey: dashboardKeys.verticalHealth(),
    queryFn: async () => {
      const { data } = await apiClient.get<VerticalHealthSummary[]>('/dashboard/vertical-health');
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useOpenExceptions = (limit: number = 5) => {
  return useQuery({
    queryKey: [...dashboardKeys.openExceptions(), limit],
    queryFn: async () => {
      const { data } = await apiClient.get<OpenException[]>('/dashboard/open-exceptions', {
        params: { limit },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const usePendingApprovals = () => {
  return useQuery({
    queryKey: [...dashboardKeys.all, 'pending-approvals'],
    queryFn: async () => {
      const { data } = await apiClient.get<PendingApproval[]>('/dashboard/pending-approvals');
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
