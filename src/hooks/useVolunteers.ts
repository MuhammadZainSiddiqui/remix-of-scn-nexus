import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { PaginatedResponse } from '@/lib/api';
import { showErrorToast, showSuccessToast } from '@/lib/errorHandler';

// Types
export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  vertical_id: string;
  vertical_name: string;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  training_status: 'not_started' | 'in_progress' | 'complete';
  training_completed_at?: string;
  insurance_valid: boolean;
  insurance_expiry?: string;
  accreditation?: string;
  hours_contributed: number;
  status: 'active' | 'inactive' | 'access_locked';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface VolunteerAssignment {
  id: string;
  volunteer_id: string;
  volunteer_name: string;
  program_id?: string;
  program_name?: string;
  vertical_id: string;
  vertical_name: string;
  hours: number;
  date: string;
  status: 'pending' | 'approved' | 'completed';
  approved_by?: string;
  created_at: string;
}

export interface VolunteerFilters {
  search?: string;
  vertical_id?: string;
  tier?: string;
  training_status?: string;
  insurance_valid?: boolean;
  status?: string;
}

// Query Keys
export const volunteerKeys = {
  all: ['volunteers'] as const,
  lists: () => [...volunteerKeys.all, 'list'] as const,
  list: (filters: VolunteerFilters, page: number, limit: number) => 
    [...volunteerKeys.lists(), { filters, page, limit }] as const,
  details: () => [...volunteerKeys.all, 'detail'] as const,
  detail: (id: string) => [...volunteerKeys.details(), id] as const,
  assignments: () => [...volunteerKeys.all, 'assignments'] as const,
  assignmentList: (filters: Record<string, unknown>, page: number, limit: number) =>
    [...volunteerKeys.assignments(), { filters, page, limit }] as const,
  stats: () => [...volunteerKeys.all, 'stats'] as const,
};

// Hooks
export const useVolunteers = (filters: VolunteerFilters = {}, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: volunteerKeys.list(filters, page, limit),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Volunteer>>('/volunteers', {
        params: { page, limit, ...filters },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useVolunteer = (id: string) => {
  return useQuery({
    queryKey: volunteerKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<Volunteer>(`/volunteers/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useVolunteerAssignments = (filters: Record<string, unknown> = {}, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: volunteerKeys.assignmentList(filters, page, limit),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<VolunteerAssignment>>('/volunteers/assignments', {
        params: { page, limit, ...filters },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useVolunteerStats = () => {
  return useQuery({
    queryKey: volunteerKeys.stats(),
    queryFn: async () => {
      const { data } = await apiClient.get('/volunteers/stats');
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateVolunteer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (volunteerData: Partial<Volunteer>) => {
      const { data } = await apiClient.post<Volunteer>('/volunteers', volunteerData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: volunteerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: volunteerKeys.stats() });
      showSuccessToast('Volunteer registered successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to register volunteer');
    },
  });
};

export const useUpdateVolunteer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...volunteerData }: Partial<Volunteer> & { id: string }) => {
      const { data } = await apiClient.put<Volunteer>(`/volunteers/${id}`, volunteerData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: volunteerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: volunteerKeys.detail(variables.id) });
      showSuccessToast('Volunteer updated successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to update volunteer');
    },
  });
};

export const useCreateAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignmentData: Partial<VolunteerAssignment>) => {
      const { data } = await apiClient.post<VolunteerAssignment>('/volunteers/assignments', assignmentData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: volunteerKeys.assignments() });
      queryClient.invalidateQueries({ queryKey: volunteerKeys.stats() });
      showSuccessToast('Assignment created successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to create assignment');
    },
  });
};

export const useLogVolunteerHours = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ volunteerId, hours, date, notes }: { volunteerId: string; hours: number; date: string; notes?: string }) => {
      const { data } = await apiClient.post(`/volunteers/${volunteerId}/log-hours`, { hours, date, notes });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: volunteerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: volunteerKeys.stats() });
      showSuccessToast('Hours logged successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to log hours');
    },
  });
};
