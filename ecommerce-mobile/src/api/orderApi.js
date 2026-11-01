import { apiClient, unwrap } from './client';

export const orderApi = {
  checkout: (payload) => unwrap(apiClient.post('/checkout', payload)),
  getMyOrders: (page = 0, size = 10) => unwrap(apiClient.get('/orders', { params: { page, size } })),
  getById: (id) => unwrap(apiClient.get(`/orders/${id}`)),
  cancel: (id) => unwrap(apiClient.post(`/orders/${id}/cancel`))
};
