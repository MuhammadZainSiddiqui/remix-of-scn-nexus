import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { PaginatedResponse } from '@/lib/api';
import { showErrorToast, showSuccessToast } from '@/lib/errorHandler';

// Types
export interface FeePlan {
  id: string;
  name: string;
  vertical_id: string;
  vertical_name: string;
  monthly_fee: number;
  currency: string;
  enrolled_count: number;
  waiver_count: number;
  description?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  invoice_no: string;
  beneficiary_id: string;
  beneficiary_name: string;
  fee_plan_id: string;
  fee_plan_name: string;
  amount: number;
  currency: string;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paid_at?: string;
  payment_method?: string;
  created_at: string;
}

export interface WaiverRequest {
  id: string;
  beneficiary_id: string;
  beneficiary_name: string;
  fee_plan_id: string;
  fee_plan_name: string;
  requested_amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requested_by: string;
  requested_by_name: string;
  approved_by?: string;
  approved_by_name?: string;
  approved_at?: string;
  created_at: string;
}

export interface FeeFilters {
  search?: string;
  vertical_id?: string;
  status?: string;
}

export interface InvoiceFilters extends FeeFilters {
  start_date?: string;
  end_date?: string;
  status?: string;
}

export interface WaiverFilters extends FeeFilters {
  status?: string;
}

// Query Keys
export const feeKeys = {
  all: ['fees'] as const,
  plans: () => [...feeKeys.all, 'plans'] as const,
  planList: (filters: FeeFilters, page: number, limit: number) =>
    [...feeKeys.plans(), { filters, page, limit }] as const,
  invoices: () => [...feeKeys.all, 'invoices'] as const,
  invoiceList: (filters: InvoiceFilters, page: number, limit: number) =>
    [...feeKeys.invoices(), { filters, page, limit }] as const,
  waivers: () => [...feeKeys.all, 'waivers'] as const,
  waiverList: (filters: WaiverFilters, page: number, limit: number) =>
    [...feeKeys.waivers(), { filters, page, limit }] as const,
  stats: () => [...feeKeys.all, 'stats'] as const,
};

// Hooks
export const useFeePlans = (filters: FeeFilters = {}, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: feeKeys.planList(filters, page, limit),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<FeePlan>>('/fees/plans', {
        params: { page, limit, ...filters },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useInvoices = (filters: InvoiceFilters = {}, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: feeKeys.invoiceList(filters, page, limit),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Invoice>>('/fees/invoices', {
        params: { page, limit, ...filters },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useWaiverRequests = (filters: WaiverFilters = {}, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: feeKeys.waiverList(filters, page, limit),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<WaiverRequest>>('/fees/waivers', {
        params: { page, limit, ...filters },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useFeeStats = () => {
  return useQuery({
    queryKey: feeKeys.stats(),
    queryFn: async () => {
      const { data } = await apiClient.get('/fees/stats');
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateFeePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planData: Partial<FeePlan>) => {
      const { data } = await apiClient.post<FeePlan>('/fees/plans', planData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feeKeys.plans() });
      showSuccessToast('Fee plan created successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to create fee plan');
    },
  });
};

export const useUpdateFeePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...planData }: Partial<FeePlan> & { id: string }) => {
      const { data } = await apiClient.put<FeePlan>(`/fees/plans/${id}`, planData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: feeKeys.plans() });
      showSuccessToast('Fee plan updated successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to update fee plan');
    },
  });
};

export const useApproveWaiver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (waiverId: string) => {
      const { data } = await apiClient.post<WaiverRequest>(`/fees/waivers/${waiverId}/approve`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feeKeys.waivers() });
      queryClient.invalidateQueries({ queryKey: feeKeys.stats() });
      showSuccessToast('Waiver approved successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to approve waiver');
    },
  });
};

export const useRejectWaiver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ waiverId, reason }: { waiverId: string; reason: string }) => {
      const { data } = await apiClient.post<WaiverRequest>(`/fees/waivers/${waiverId}/reject`, { reason });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feeKeys.waivers() });
      showSuccessToast('Waiver rejected');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to reject waiver');
    },
  });
};

export const useCreateWaiverRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (waiverData: { beneficiary_id: string; fee_plan_id: string; requested_amount: number; reason: string }) => {
      const { data } = await apiClient.post<WaiverRequest>('/fees/waivers', waiverData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feeKeys.waivers() });
      showSuccessToast('Waiver request submitted successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to submit waiver request');
    },
  });
};
