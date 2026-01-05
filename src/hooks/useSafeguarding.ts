import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { PaginatedResponse } from '@/lib/api';
import { showErrorToast, showSuccessToast } from '@/lib/errorHandler';

// Types
export interface SafeguardingCase {
  id: string;
  case_no: string;
  summary: string;
  status: 'active' | 'under_review' | 'resolved' | 'closed';
  severity: 'critical' | 'high' | 'medium' | 'low';
  sla_deadline: string;
  assigned_to: string;
  assigned_to_id?: string;
  vertical_id: string;
  vertical_name: string;
  notes_count: number;
  created_at: string;
  updated_at: string;
}

export interface SafeguardingNote {
  id: string;
  case_id: string;
  content: string;
  author: string;
  author_id?: string;
  created_at: string;
}

export interface CreateCaseInput {
  summary: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  vertical_id: string;
  assigned_to: string;
  notes?: string;
}

export interface AddNoteInput {
  case_id: string;
  content: string;
}

// Query Keys
export const safeguardingKeys = {
  all: ['safeguarding'] as const,
  lists: () => [...safeguardingKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>, page: number, limit: number) => 
    [...safeguardingKeys.lists(), { filters, page, limit }] as const,
  details: () => [...safeguardingKeys.all, 'detail'] as const,
  detail: (id: string) => [...safeguardingKeys.details(), id] as const,
  notes: (id: string) => [...safeguardingKeys.detail(id), 'notes'] as const,
  stats: () => [...safeguardingKeys.all, 'stats'] as const,
};

// Hooks
export const useSafeguardingCases = (filters: Record<string, unknown> = {}, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: safeguardingKeys.list(filters, page, limit),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<SafeguardingCase>>('/safeguarding/cases', {
        params: { page, limit, ...filters },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useSafeguardingCase = (id: string) => {
  return useQuery({
    queryKey: safeguardingKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<SafeguardingCase>(`/safeguarding/cases/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useSafeguardingNotes = (caseId: string) => {
  return useQuery({
    queryKey: safeguardingKeys.notes(caseId),
    queryFn: async () => {
      const { data } = await apiClient.get<SafeguardingNote[]>(`/safeguarding/cases/${caseId}/notes`);
      return data;
    },
    enabled: !!caseId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSafeguardingStats = () => {
  return useQuery({
    queryKey: safeguardingKeys.stats(),
    queryFn: async () => {
      const { data } = await apiClient.get('/safeguarding/stats');
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateSafeguardingCase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (caseData: CreateCaseInput) => {
      const { data } = await apiClient.post<SafeguardingCase>('/safeguarding/cases', caseData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: safeguardingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: safeguardingKeys.stats() });
      showSuccessToast('Case created successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to create case');
    },
  });
};

export const useUpdateCaseStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: SafeguardingCase['status'] }) => {
      const { data } = await apiClient.put<SafeguardingCase>(`/safeguarding/cases/${id}/status`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: safeguardingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: safeguardingKeys.stats() });
      showSuccessToast('Case status updated successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to update case status');
    },
  });
};

export const useAddSafeguardingNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (noteData: AddNoteInput) => {
      const { data } = await apiClient.post<SafeguardingNote>(`/safeguarding/cases/${noteData.case_id}/notes`, {
        content: noteData.content,
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: safeguardingKeys.notes(variables.case_id) });
      showSuccessToast('Note added successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to add note');
    },
  });
};
