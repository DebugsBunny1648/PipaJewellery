import { apiClient, unwrap } from './client';

export const categoryApi = {
  getAll: () => unwrap(apiClient.get('/categories')),
  getTree: () => unwrap(apiClient.get('/categories/tree')),
  create: (payload) => unwrap(apiClient.post('/admin/categories', payload)),
  update: (id, payload) => unwrap(apiClient.put(`/admin/categories/${id}`, payload)),
  remove: (id) => unwrap(apiClient.delete(`/admin/categories/${id}`)),
  updateStatus: (id, active) => unwrap(apiClient.patch(`/admin/categories/${id}/status`, null, { params: { active } }))
};
