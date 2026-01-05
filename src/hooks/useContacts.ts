import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { PaginatedResponse } from '@/lib/api';
import { showErrorToast, showSuccessToast } from '@/lib/errorHandler';

// Types
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  contact_type: 'donor' | 'parent' | 'volunteer' | 'vendor' | 'partner';
  vertical_id?: string;
  vertical_name?: string;
  status: 'active' | 'inactive' | 'pending';
  total_donated?: number;
  last_donation?: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, unknown>;
}

export interface ContactFilters {
  search?: string;
  contact_type?: string;
  vertical_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
}

// Query Keys
export const contactKeys = {
  all: ['contacts'] as const,
  lists: () => [...contactKeys.all, 'list'] as const,
  list: (filters: ContactFilters, page: number, limit: number) => 
    [...contactKeys.lists(), { filters, page, limit }] as const,
  details: () => [...contactKeys.all, 'detail'] as const,
  detail: (id: string) => [...contactKeys.details(), id] as const,
};

// Hooks
export const useContacts = (filters: ContactFilters = {}, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: contactKeys.list(filters, page, limit),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Contact>>('/contacts', {
        params: { page, limit, ...filters },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useContact = (id: string) => {
  return useQuery({
    queryKey: contactKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<Contact>(`/contacts/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contactData: Partial<Contact>) => {
      const { data } = await apiClient.post<Contact>('/contacts', contactData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      showSuccessToast('Contact created successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to create contact');
    },
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...contactData }: Partial<Contact> & { id: string }) => {
      const { data } = await apiClient.put<Contact>(`/contacts/${id}`, contactData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contactKeys.detail(variables.id) });
      showSuccessToast('Contact updated successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to update contact');
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/contacts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      showSuccessToast('Contact deleted successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to delete contact');
    },
  });
};

// Donor-specific hooks
export const useDonors = (filters: ContactFilters = {}, page: number = 1, limit: number = 10) => {
  return useContacts({ ...filters, contact_type: 'donor' }, page, limit);
};

export const useParents = (filters: ContactFilters = {}, page: number = 1, limit: number = 10) => {
  return useContacts({ ...filters, contact_type: 'parent' }, page, limit);
};

export const useVolunteerContacts = (filters: ContactFilters = {}, page: number = 1, limit: number = 10) => {
  return useContacts({ ...filters, contact_type: 'volunteer' }, page, limit);
};

export const useVendors = (filters: ContactFilters = {}, page: number = 1, limit: number = 10) => {
  return useContacts({ ...filters, contact_type: 'vendor' }, page, limit);
};

export const usePartners = (filters: ContactFilters = {}, page: number = 1, limit: number = 10) => {
  return useContacts({ ...filters, contact_type: 'partner' }, page, limit);
};
