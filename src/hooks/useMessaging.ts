import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { PaginatedResponse } from '@/lib/api';
import { showErrorToast, showSuccessToast } from '@/lib/errorHandler';

// Types
export interface Message {
  id: string;
  type: 'email' | 'sms' | 'whatsapp' | 'portal';
  recipient: string;
  recipient_id?: string;
  subject?: string;
  content: string;
  channel: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'read';
  restricted: boolean;
  sent_at?: string;
  delivered_at?: string;
  read_at?: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  title: string;
  type: 'direct' | 'group';
  participants: ConversationParticipant[];
  last_message?: Message;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface ConversationParticipant {
  user_id: string;
  user_name: string;
  role: string;
  joined_at: string;
  last_read?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  created_at: string;
}

export interface SendMessageInput {
  type: 'email' | 'sms' | 'whatsapp' | 'portal';
  recipient: string;
  recipient_id?: string;
  subject?: string;
  content: string;
  restricted?: boolean;
}

export interface CreateConversationInput {
  title: string;
  type: 'direct' | 'group';
  participant_ids: string[];
}

// Query Keys
export const messageKeys = {
  all: ['messages'] as const,
  lists: () => [...messageKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>, page: number, limit: number) => 
    [...messageKeys.lists(), { filters, page, limit }] as const,
  details: () => [...messageKeys.all, 'detail'] as const,
  detail: (id: string) => [...messageKeys.details(), id] as const,
};

export const conversationKeys = {
  all: ['conversations'] as const,
  lists: () => [...conversationKeys.all, 'list'] as const,
  list: (page: number, limit: number) => [...conversationKeys.lists(), { page, limit }] as const,
  details: () => [...conversationKeys.all, 'detail'] as const,
  detail: (id: string) => [...conversationKeys.details(), id] as const,
  messages: (id: string) => [...conversationKeys.detail(id), 'messages'] as const,
  messageList: (id: string, page: number, limit: number) =>
    [...conversationKeys.messages(id), { page, limit }] as const,
};

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (page: number, limit: number) => [...notificationKeys.lists(), { page, limit }] as const,
  unread: () => [...notificationKeys.all, 'unread'] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
};

// Message Hooks
export const useMessages = (filters: Record<string, unknown> = {}, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: messageKeys.list(filters, page, limit),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Message>>('/messages', {
        params: { page, limit, ...filters },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useMessage = (id: string) => {
  return useQuery({
    queryKey: messageKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<Message>(`/messages/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageData: SendMessageInput) => {
      const { data } = await apiClient.post<Message>('/messages', messageData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
      showSuccessToast('Message sent successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to send message');
    },
  });
};

// Conversation Hooks
export const useConversations = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: conversationKeys.list(page, limit),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Conversation>>('/conversations', {
        params: { page, limit },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useConversation = (id: string) => {
  return useQuery({
    queryKey: conversationKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<Conversation>(`/conversations/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useConversationMessages = (conversationId: string, page: number = 1, limit: number = 50) => {
  return useQuery({
    queryKey: conversationKeys.messageList(conversationId, page, limit),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Message>>(`/conversations/${conversationId}/messages`, {
        params: { page, limit },
      });
      return data;
    },
    enabled: !!conversationId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationData: CreateConversationInput) => {
      const { data } = await apiClient.post<Conversation>('/conversations', conversationData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
      showSuccessToast('Conversation created successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to create conversation');
    },
  });
};

export const useSendConversationMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, content, attachments }: { conversationId: string; content: string; attachments?: string[] }) => {
      const { data } = await apiClient.post<Message>(`/conversations/${conversationId}/messages`, { content, attachments });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.messages(variables.conversationId) });
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to send message');
    },
  });
};

// Notification Hooks
export const useNotifications = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: notificationKeys.list(page, limit),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Notification>>('/notifications', {
        params: { page, limit },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useUnreadNotifications = () => {
  return useQuery({
    queryKey: notificationKeys.unread(),
    queryFn: async () => {
      const { data } = await apiClient.get<Notification[]>('/notifications/unread');
      return data;
    },
    staleTime: 30 * 1000, // 30 seconds for real-time updates
  });
};

export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: async () => {
      const { data } = await apiClient.get<{ count: number }>('/notifications/unread/count');
      return data.count;
    },
    staleTime: 30 * 1000, // 30 seconds for real-time updates
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      await apiClient.put(`/notifications/${notificationId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unread() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to mark notification as read');
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.put('/notifications/read-all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unread() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
      showSuccessToast('All notifications marked as read');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to mark notifications as read');
    },
  });
};
