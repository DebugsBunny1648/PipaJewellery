import { apiClient, unwrap } from './client';

export const roleApi = {
  getAll: () => unwrap(apiClient.get('/admin/roles')),
  getAllPermissions: () => unwrap(apiClient.get('/admin/roles/permissions')),
  updatePermissions: (roleId, permissionIds) => unwrap(apiClient.put(`/admin/roles/${roleId}/permissions`, permissionIds))
};
