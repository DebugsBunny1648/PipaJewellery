import { apiClient, unwrap } from './client';

export const inventoryApi = {
  getByProduct: (productId) => unwrap(apiClient.get(`/admin/inventory/product/${productId}`)),
  adjust: (productId, params) => unwrap(apiClient.put(`/admin/inventory/product/${productId}`, null, { params }))
};
