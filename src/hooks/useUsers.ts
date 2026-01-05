import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { PaginatedResponse } from '@/lib/api';
import { showErrorToast, showSuccessToast } from '@/lib/errorHandler';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role_id: string;
  role_name: string;
  vertical_id?: string;
  vertical_name?: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  last_login?: string;
  policy_ack: boolean;
  restricted_access: boolean;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  level: string;
  restricted: boolean;
}

export interface UserFilters {
  search?: string;
  role_id?: string;
  vertical_id?: string;
  status?: string;
}

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters, page: number, limit: number) => 
    [...userKeys.lists(), { filters, page, limit }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  roles: () => [...userKeys.all, 'roles'] as const,
};

// Hooks
export const useUsers = (filters: UserFilters = {}, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: userKeys.list(filters, page, limit),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<User>>('/users', {
        params: { page, limit, ...filters },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<User>(`/users/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useRoles = () => {
  return useQuery({
    queryKey: userKeys.roles(),
    queryFn: async () => {
      const { data } = await apiClient.get<Role[]>('/auth/roles');
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: Partial<User>) => {
      const { data } = await apiClient.post<User>('/users', userData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      showSuccessToast('User created successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to create user');
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...userData }: Partial<User> & { id: string }) => {
      const { data } = await apiClient.put<User>(`/users/${id}`, userData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      showSuccessToast('User updated successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to update user');
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, role_id }: { id: string; role_id: string }) => {
      const { data } = await apiClient.put<User>(`/users/${id}/role`, { role_id });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      showSuccessToast('User role updated successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to update user role');
    },
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: User['status'] }) => {
      const { data } = await apiClient.put<User>(`/users/${id}/status`, { status });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      showSuccessToast(`User ${status === 'active' ? 'activated' : 'deactivated'} successfully`);
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to update user status');
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      showSuccessToast('User deleted successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to delete user');
    },
  });
};

// User statistics
export const useUserStats = () => {
  return useQuery({
    queryKey: [...userKeys.all, 'stats'],
    queryFn: async () => {
      const { data } = await apiClient.get('/users/stats');
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
