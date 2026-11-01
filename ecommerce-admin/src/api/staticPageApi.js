import { apiClient, unwrap } from './client';

export const staticPageApi = {
  getAll: () => unwrap(apiClient.get('/admin/pages')),
  create: (payload) => unwrap(apiClient.post('/admin/pages', payload)),
  update: (id, payload) => unwrap(apiClient.put(`/admin/pages/${id}`, payload)),
  remove: (id) => unwrap(apiClient.delete(`/admin/pages/${id}`)),
  updateStatus: (id, active) => unwrap(apiClient.patch(`/admin/pages/${id}/status`, null, { params: { active } }))
};
