import { apiClient, unwrap } from './client';

export const cmsApi = {
  getAll: () => unwrap(apiClient.get('/admin/cms/sections')),
  create: (payload) => unwrap(apiClient.post('/admin/cms/sections', payload)),
  update: (id, payload) => unwrap(apiClient.put(`/admin/cms/sections/${id}`, payload)),
  remove: (id) => unwrap(apiClient.delete(`/admin/cms/sections/${id}`)),
  updateStatus: (id, active) => unwrap(apiClient.patch(`/admin/cms/sections/${id}/status`, null, { params: { active } })),
  reorder: (orderedIds) => unwrap(apiClient.patch('/admin/cms/sections/reorder', orderedIds))
};
