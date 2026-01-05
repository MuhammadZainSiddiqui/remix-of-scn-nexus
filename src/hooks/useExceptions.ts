import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { PaginatedResponse } from '@/lib/api';
import { showErrorToast, showSuccessToast } from '@/lib/errorHandler';

// Types
export interface Exception {
  id: string;
  type: string;
  level: number;
  description: string;
  owner: string;
  owner_id?: string;
  deadline: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'escalated';
  vertical_id: string;
  vertical_name: string;
  assigned_to?: string;
  assigned_to_name?: string;
  escalated_to?: string;
  escalated_at?: string;
  comments_count: number;
  history?: ExceptionHistory[];
  created_at: string;
  updated_at: string;
}

export interface ExceptionHistory {
  id: string;
  action: string;
  actor: string;
  actor_name: string;
  details?: string;
  timestamp: string;
}

export interface ExceptionFilters {
  search?: string;
  vertical_id?: string;
  type?: string;
  level?: number;
  status?: string;
  assigned_to?: string;
  start_date?: string;
  end_date?: string;
}

export interface CreateExceptionInput {
  type: string;
  level: number;
  description: string;
  vertical_id: string;
  owner_id?: string;
  deadline: string;
}

export interface EscalateExceptionInput {
  exception_id: string;
  escalate_to: string;
  reason: string;
}

export interface AddCommentInput {
  exception_id: string;
  comment: string;
}

// Query Keys
export const exceptionKeys = {
  all: ['exceptions'] as const,
  lists: () => [...exceptionKeys.all, 'list'] as const,
  list: (filters: ExceptionFilters, page: number, limit: number) => 
    [...exceptionKeys.lists(), { filters, page, limit }] as const,
  details: () => [...exceptionKeys.all, 'detail'] as const,
  detail: (id: string) => [...exceptionKeys.details(), id] as const,
  history: (id: string) => [...exceptionKeys.detail(id), 'history'] as const,
  stats: () => [...exceptionKeys.all, 'stats'] as const,
};

// Hooks
export const useExceptions = (filters: ExceptionFilters = {}, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: exceptionKeys.list(filters, page, limit),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Exception>>('/exceptions', {
        params: { page, limit, ...filters },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useException = (id: string) => {
  return useQuery({
    queryKey: exceptionKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<Exception>(`/exceptions/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useExceptionHistory = (id: string) => {
  return useQuery({
    queryKey: exceptionKeys.history(id),
    queryFn: async () => {
      const { data } = await apiClient.get<ExceptionHistory[]>(`/exceptions/${id}/history`);
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useExceptionStats = () => {
  return useQuery({
    queryKey: exceptionKeys.stats(),
    queryFn: async () => {
      const { data } = await apiClient.get('/exceptions/stats');
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateException = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (exceptionData: CreateExceptionInput) => {
      const { data } = await apiClient.post<Exception>('/exceptions', exceptionData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exceptionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: exceptionKeys.stats() });
      showSuccessToast('Exception created successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to create exception');
    },
  });
};

export const useUpdateExceptionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, reason }: { id: string; status: Exception['status']; reason?: string }) => {
      const { data } = await apiClient.put<Exception>(`/exceptions/${id}/status`, { status, reason });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exceptionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: exceptionKeys.stats() });
      showSuccessToast('Exception status updated successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to update exception status');
    },
  });
};

export const useAssignException = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, assigned_to }: { id: string; assigned_to: string }) => {
      const { data } = await apiClient.put<Exception>(`/exceptions/${id}/assign`, { assigned_to });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exceptionKeys.lists() });
      showSuccessToast('Exception assigned successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to assign exception');
    },
  });
};

export const useEscalateException = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (escalationData: EscalateExceptionInput) => {
      const { data } = await apiClient.post<Exception>(`/exceptions/${escalationData.exception_id}/escalate`, escalationData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exceptionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: exceptionKeys.stats() });
      showSuccessToast('Exception escalated successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to escalate exception');
    },
  });
};

export const useAddExceptionComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentData: AddCommentInput) => {
      const { data } = await apiClient.post(`/exceptions/${commentData.exception_id}/comments`, { comment: commentData.comment });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: exceptionKeys.detail(variables.exception_id) });
      showSuccessToast('Comment added successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to add comment');
    },
  });
};
