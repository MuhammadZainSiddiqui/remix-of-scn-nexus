import { useQuery } from '@tanstack/react-query';
import apiClient, { PaginatedResponse } from '@/lib/api';

// Types
export interface AuditLogEntry {
  id: string;
  action: string;
  actor: string;
  actor_id?: string;
  timestamp: string;
  reason?: string;
  reference: string;
  module: string;
  details?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
}

export interface AuditLogFilters {
  search?: string;
  module?: string;
  actor?: string;
  action?: string;
  start_date?: string;
  end_date?: string;
  reference?: string;
}

// Query Keys
export const auditLogKeys = {
  all: ['audit-log'] as const,
  lists: () => [...auditLogKeys.all, 'list'] as const,
  list: (filters: AuditLogFilters, page: number, limit: number) => 
    [...auditLogKeys.lists(), { filters, page, limit }] as const,
  details: () => [...auditLogKeys.all, 'detail'] as const,
  detail: (id: string) => [...auditLogKeys.details(), id] as const,
  stats: () => [...auditLogKeys.all, 'stats'] as const,
};

// Hooks
export const useAuditLogs = (filters: AuditLogFilters = {}, page: number = 1, limit: number = 50) => {
  return useQuery({
    queryKey: auditLogKeys.list(filters, page, limit),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<AuditLogEntry>>('/audit', {
        params: { page, limit, ...filters },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - audit logs don't change often
  });
};

export const useAuditLog = (id: string) => {
  return useQuery({
    queryKey: auditLogKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<AuditLogEntry>(`/audit/${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAuditLogStats = () => {
  return useQuery({
    queryKey: auditLogKeys.stats(),
    queryFn: async () => {
      const { data } = await apiClient.get('/audit/stats');
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
