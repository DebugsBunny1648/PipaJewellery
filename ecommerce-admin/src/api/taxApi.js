import { apiClient, unwrap } from './client';

export const taxApi = {
  getAll: () => unwrap(apiClient.get('/admin/taxes')),
  create: (payload) => unwrap(apiClient.post('/admin/taxes', payload)),
  update: (id, payload) => unwrap(apiClient.put(`/admin/taxes/${id}`, payload)),
  remove: (id) => unwrap(apiClient.delete(`/admin/taxes/${id}`))
};
