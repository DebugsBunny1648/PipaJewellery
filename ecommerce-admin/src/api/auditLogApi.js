import { apiClient, unwrap } from './client';

export const auditLogApi = {
  getAll: (page = 0, size = 50) => unwrap(apiClient.get('/admin/audit-logs', { params: { page, size } }))
};
