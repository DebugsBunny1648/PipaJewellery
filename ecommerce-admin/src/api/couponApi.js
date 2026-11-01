import { apiClient, unwrap } from './client';

export const couponApi = {
  getAll: () => unwrap(apiClient.get('/admin/coupons')),
  create: (payload) => unwrap(apiClient.post('/admin/coupons', payload)),
  update: (id, payload) => unwrap(apiClient.put(`/admin/coupons/${id}`, payload)),
  remove: (id) => unwrap(apiClient.delete(`/admin/coupons/${id}`))
};
