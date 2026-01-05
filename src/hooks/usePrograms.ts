import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { PaginatedResponse } from '@/lib/api';
import { showErrorToast, showSuccessToast } from '@/lib/errorHandler';

// Types
export interface Program {
  id: string;
  name: string;
  description?: string;
  vertical_id: string;
  vertical_name: string;
  status: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  budget?: number;
  actual_spent?: number;
  target_beneficiaries?: number;
  actual_beneficiaries?: number;
  created_at: string;
  updated_at: string;
}

export interface KPI {
  id: string;
  program_id: string;
  program_name: string;
  indicator: string;
  target: number;
  actual: number;
  unit: string;
  status: 'exceeded' | 'on_track' | 'behind' | 'not_started';
  vertical_id: string;
  vertical_name: string;
  measurement_date: string;
  created_at: string;
  updated_at: string;
}

export interface ProgramFilters {
  search?: string;
  vertical_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
}

export interface KPIFilters {
  search?: string;
  vertical_id?: string;
  program_id?: string;
  status?: string;
}

// Query Keys
export const programKeys = {
  all: ['programs'] as const,
  lists: () => [...programKeys.all, 'list'] as const,
  list: (filters: ProgramFilters, page: number, limit: number) => 
    [...programKeys.lists(), { filters, page, limit }] as const,
  details: () => [...programKeys.all, 'detail'] as const,
  detail: (id: string) => [...programKeys.details(), id] as const,
  kpis: () => [...programKeys.all, 'kpis'] as const,
  kpiList: (filters: KPIFilters, page: number, limit: number) =>
    [...programKeys.kpis(), { filters, page, limit }] as const,
  stats: () => [...programKeys.all, 'stats'] as const,
};

// Hooks
export const usePrograms = (filters: ProgramFilters = {}, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: programKeys.list(filters, page, limit),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Program>>('/programs', {
        params: { page, limit, ...filters },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useProgram = (id: string) => {
  return useQuery({
    queryKey: programKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<Program>(`/programs/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useKPIs = (filters: KPIFilters = {}, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: programKeys.kpiList(filters, page, limit),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<KPI>>('/kpis', {
        params: { page, limit, ...filters },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useProgramStats = () => {
  return useQuery({
    queryKey: programKeys.stats(),
    queryFn: async () => {
      const { data } = await apiClient.get('/programs/stats');
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (programData: Partial<Program>) => {
      const { data } = await apiClient.post<Program>('/programs', programData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programKeys.lists() });
      queryClient.invalidateQueries({ queryKey: programKeys.stats() });
      showSuccessToast('Program created successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to create program');
    },
  });
};

export const useUpdateProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...programData }: Partial<Program> & { id: string }) => {
      const { data } = await apiClient.put<Program>(`/programs/${id}`, programData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: programKeys.lists() });
      queryClient.invalidateQueries({ queryKey: programKeys.detail(variables.id) });
      showSuccessToast('Program updated successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to update program');
    },
  });
};

export const useUpdateKPIStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, actual }: { id: string; status: KPI['status']; actual?: number }) => {
      const { data } = await apiClient.put<KPI>(`/kpis/${id}`, { status, actual });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programKeys.kpis() });
      showSuccessToast('KPI status updated successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to update KPI status');
    },
  });
};
