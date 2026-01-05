import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { PaginatedResponse } from '@/lib/api';
import { showErrorToast, showSuccessToast } from '@/lib/errorHandler';

// Types
export interface Vendor {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone?: string;
  category: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  performance_score?: number;
  total_orders?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Requisition {
  id: string;
  req_no: string;
  item: string;
  quantity: number;
  estimated_cost: number;
  status: 'requisition' | 'rfq_sent' | 'quotes_received' | 'po_approved' | 'grn_pending' | 'complete' | 'cancelled';
  stage: string;
  vertical_id: string;
  vertical_name: string;
  quotes_count: number;
  selected_vendor_id?: string;
  selected_vendor_name?: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  id: string;
  item_name: string;
  sku?: string;
  category: string;
  quantity: number;
  unit: string;
  min_stock_level: number;
  location?: string;
  last_restocked?: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  created_at: string;
  updated_at: string;
}

export interface InventoryTransaction {
  id: string;
  item_id: string;
  item_name: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason?: string;
  reference_type?: string;
  reference_id?: string;
  performed_by: string;
  performed_at: string;
}

export interface VendorFilters {
  search?: string;
  category?: string;
  status?: string;
}

export interface RequisitionFilters {
  search?: string;
  vertical_id?: string;
  status?: string;
  stage?: string;
}

export interface InventoryFilters {
  search?: string;
  category?: string;
  status?: string;
}

// Query Keys
export const vendorKeys = {
  all: ['vendors'] as const,
  lists: () => [...vendorKeys.all, 'list'] as const,
  list: (filters: VendorFilters, page: number, limit: number) => 
    [...vendorKeys.lists(), { filters, page, limit }] as const,
  details: () => [...vendorKeys.all, 'detail'] as const,
  detail: (id: string) => [...vendorKeys.details(), id] as const,
};

export const requisitionKeys = {
  all: ['requisitions'] as const,
  lists: () => [...requisitionKeys.all, 'list'] as const,
  list: (filters: RequisitionFilters, page: number, limit: number) => 
    [...requisitionKeys.lists(), { filters, page, limit }] as const,
  details: () => [...requisitionKeys.all, 'detail'] as const,
  detail: (id: string) => [...requisitionKeys.details(), id] as const,
  pipeline: () => [...requisitionKeys.all, 'pipeline'] as const,
};

export const inventoryKeys = {
  all: ['inventory'] as const,
  lists: () => [...inventoryKeys.all, 'list'] as const,
  list: (filters: InventoryFilters, page: number, limit: number) => 
    [...inventoryKeys.lists(), { filters, page, limit }] as const,
  details: () => [...inventoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...inventoryKeys.details(), id] as const,
  transactions: () => [...inventoryKeys.all, 'transactions'] as const,
  transactionList: (itemId?: string, page: number, limit: number) =>
    [...inventoryKeys.transactions(), { itemId, page, limit }] as const,
  lowStock: () => [...inventoryKeys.all, 'low-stock'] as const,
};

// Vendor Hooks
export const useVendors = (filters: VendorFilters = {}, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: vendorKeys.list(filters, page, limit),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Vendor>>('/vendors', {
        params: { page, limit, ...filters },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useVendor = (id: string) => {
  return useQuery({
    queryKey: vendorKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<Vendor>(`/vendors/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vendorData: Partial<Vendor>) => {
      const { data } = await apiClient.post<Vendor>('/vendors', vendorData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
      showSuccessToast('Vendor created successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to create vendor');
    },
  });
};

export const useUpdateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...vendorData }: Partial<Vendor> & { id: string }) => {
      const { data } = await apiClient.put<Vendor>(`/vendors/${id}`, vendorData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: vendorKeys.detail(variables.id) });
      showSuccessToast('Vendor updated successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to update vendor');
    },
  });
};

// Requisition Hooks
export const useRequisitions = (filters: RequisitionFilters = {}, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: requisitionKeys.list(filters, page, limit),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Requisition>>('/requisitions', {
        params: { page, limit, ...filters },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useRequisitionPipeline = () => {
  return useQuery({
    queryKey: requisitionKeys.pipeline(),
    queryFn: async () => {
      const { data } = await apiClient.get('/requisitions/pipeline');
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateRequisition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requisitionData: Partial<Requisition>) => {
      const { data } = await apiClient.post<Requisition>('/requisitions', requisitionData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requisitionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: requisitionKeys.pipeline() });
      showSuccessToast('Requisition created successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to create requisition');
    },
  });
};

export const useUpdateRequisitionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, selected_vendor_id }: { id: string; status: Requisition['status']; selected_vendor_id?: string }) => {
      const { data } = await apiClient.put<Requisition>(`/requisitions/${id}/status`, { status, selected_vendor_id });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requisitionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: requisitionKeys.pipeline() });
      showSuccessToast('Requisition status updated successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to update requisition status');
    },
  });
};

// Inventory Hooks
export const useInventory = (filters: InventoryFilters = {}, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: inventoryKeys.list(filters, page, limit),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<InventoryItem>>('/inventory', {
        params: { page, limit, ...filters },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useLowStockItems = () => {
  return useQuery({
    queryKey: inventoryKeys.lowStock(),
    queryFn: async () => {
      const { data } = await apiClient.get<InventoryItem[]>('/inventory/low-stock');
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useInventoryTransactions = (itemId?: string, page: number = 1, limit: number = 50) => {
  return useQuery({
    queryKey: inventoryKeys.transactionList(itemId, page, limit),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<InventoryTransaction>>('/inventory/transactions', {
        params: { page, limit, item_id: itemId },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateInventoryTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionData: { item_id: string; type: 'in' | 'out' | 'adjustment'; quantity: number; reason?: string; reference_type?: string; reference_id?: string }) => {
      const { data } = await apiClient.post<InventoryTransaction>('/inventory/transactions', transactionData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lowStock() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.transactions() });
      showSuccessToast('Transaction recorded successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to record transaction');
    },
  });
};

export const useAdjustInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, quantity, reason }: { itemId: string; quantity: number; reason: string }) => {
      const { data } = await apiClient.post<InventoryItem>(`/inventory/${itemId}/adjust`, { quantity, reason });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lowStock() });
      showSuccessToast('Inventory adjusted successfully');
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to adjust inventory');
    },
  });
};
