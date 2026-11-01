import { apiClient, unwrap } from './client';

export const siteConfigApi = {
  getAll: () => unwrap(apiClient.get('/admin/config')),
  upsert: (key, value, group, description) =>
    unwrap(apiClient.put('/admin/config', null, { params: { key, value, group, description } })),
  remove: (key) => unwrap(apiClient.delete(`/admin/config/${key}`))
};
