import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { PaginatedResponse } from '@/lib/api';
import { showErrorToast, showSuccessToast } from '@/lib/errorHandler';

// Types
export interface Staff {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  department: string;
  vertical_id: string;
  vertical_name: string;
  attendance_percentage: number;
  overtime_hours: number;
  contract_end?: string;
  policy_ack: boolean;
  burnout_risk: 'low' | 'medium' | 'high';
  status: 'active' | 'inactive' | 'on_leave' | 'terminated';
  hire_date?: string;
  created_at: string;
  updated_at: string;
}

export interface StaffFilters {
  search?: string;
  vertical_id?: string;
  department?: string;
  burnout_risk?: string;
  status?: string;
}

// Query Keys
export const staffKeys = {
  all: ['staff'] as const,
  lists: () => [...staffKeys.all, 'list'] as const,
  list: (filters: StaffFilters, page: number, limit: number) => 
    [...staffKeys.lists(), { filters, page, limit }] as const,
  details: () => [...staffKeys.all, 'detail'] as const,
  detail: (id: string) => [...staffKeys.details(), id] as const,
  stats: () => [...staffKeys.all, 'stats'] as const,
};

// Hooks
export const useStaff = (filters: StaffFilters = {}, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: staffKeys.list(filters, page, limit),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Staff>>('/staff', {
        params: { page, limit, ...filters },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useStaffMember = (id: string) => {
  return useQuery({
    queryKey: staffKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<Staff>(`/staff/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useStaffStats = () => {
  return useQuery({
    queryKey: staffKeys.stats(),
    queryFn: async () => {
      const { data } = await apiClient.get('/staff/stats');
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (staffData: Partial<Staff>) => {
      const { data } = await apiClient.post<Staff>('/staff', staffData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      queryClient.invalidateQueries({ queryKey: staffKeys.stats() });
      showSuccessToast('Staff member added successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to add staff member');
    },
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...staffData }: Partial<Staff> & { id: string }) => {
      const { data } = await apiClient.put<Staff>(`/staff/${id}`, staffData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      queryClient.invalidateQueries({ queryKey: staffKeys.detail(variables.id) });
      showSuccessToast('Staff member updated successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to update staff member');
    },
  });
};

export const useUpdateStaffStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Staff['status'] }) => {
      const { data } = await apiClient.put<Staff>(`/staff/${id}/status`, { status });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      queryClient.invalidateQueries({ queryKey: staffKeys.detail(variables.id) });
      showSuccessToast('Staff status updated successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to update staff status');
    },
  });
};
