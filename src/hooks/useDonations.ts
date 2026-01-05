import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { PaginatedResponse } from '@/lib/api';
import { showErrorToast, showSuccessToast } from '@/lib/errorHandler';

// Types
export interface Donation {
  id: string;
  donor_id: string;
  donor_name: string;
  amount: number;
  currency: string;
  donation_type: 'unrestricted' | 'restricted' | 'zakat';
  fund_type: string;
  vertical_id?: string;
  vertical_name?: string;
  program_id?: string;
  program_name?: string;
  status: 'pending' | 'allocated' | 'received' | 'refunded';
  receipt_no?: string;
  receipt_issued: boolean;
  date: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, unknown>;
}

export interface DonationFilters {
  search?: string;
  donor_id?: string;
  donation_type?: string;
  vertical_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  min_amount?: number;
  max_amount?: number;
}

export interface CreateDonationInput {
  donor_id: string;
  amount: number;
  donation_type: 'unrestricted' | 'restricted' | 'zakat';
  fund_type: string;
  vertical_id?: string;
  program_id?: string;
  notes?: string;
}

export interface AllocateDonationInput {
  donation_id: string;
  vertical_id: string;
  program_id?: string;
  amount: number;
  notes?: string;
}

// Query Keys
export const donationKeys = {
  all: ['donations'] as const,
  lists: () => [...donationKeys.all, 'list'] as const,
  list: (filters: DonationFilters, page: number, limit: number) => 
    [...donationKeys.lists(), { filters, page, limit }] as const,
  details: () => [...donationKeys.all, 'detail'] as const,
  detail: (id: string) => [...donationKeys.details(), id] as const,
  stats: () => [...donationKeys.all, 'stats'] as const,
};

// Hooks
export const useDonations = (filters: DonationFilters = {}, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: donationKeys.list(filters, page, limit),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Donation>>('/donations', {
        params: { page, limit, ...filters },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useDonation = (id: string) => {
  return useQuery({
    queryKey: donationKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<Donation>(`/donations/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useDonationStats = (filters: DonationFilters = {}) => {
  return useQuery({
    queryKey: [...donationKeys.stats(), filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/donations/stats', { params: filters });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateDonation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (donationData: CreateDonationInput) => {
      const { data } = await apiClient.post<Donation>('/donations', donationData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: donationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: donationKeys.stats() });
      showSuccessToast('Donation recorded successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to record donation');
    },
  });
};

export const useAllocateDonation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (allocationData: AllocateDonationInput) => {
      const { data } = await apiClient.post('/donations/allocate', allocationData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: donationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: donationKeys.stats() });
      showSuccessToast('Donation allocated successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to allocate donation');
    },
  });
};

export const useIssueReceipt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (donationId: string) => {
      const { data } = await apiClient.post(`/donations/${donationId}/receipt`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: donationKeys.lists() });
      showSuccessToast('Receipt issued successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to issue receipt');
    },
  });
};
