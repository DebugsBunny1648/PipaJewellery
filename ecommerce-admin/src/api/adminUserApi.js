import { apiClient, unwrap } from './client';

export const adminUserApi = {
  getAll: () => unwrap(apiClient.get('/admin/users')),
  create: (adminUser, password, roleId) =>
    unwrap(apiClient.post('/admin/users', adminUser, { params: { password, roleId } })),
  update: (id, adminUser, roleId) =>
    unwrap(apiClient.put(`/admin/users/${id}`, adminUser, { params: { roleId } })),
  remove: (id) => unwrap(apiClient.delete(`/admin/users/${id}`)),
  updateStatus: (id, active) => unwrap(apiClient.patch(`/admin/users/${id}/status`, null, { params: { active } }))
};
