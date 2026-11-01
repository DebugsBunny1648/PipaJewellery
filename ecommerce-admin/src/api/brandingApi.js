import { apiClient, unwrap } from './client';

export const brandingApi = {
  getAll: () => unwrap(apiClient.get('/admin/branding')),
  upsert: (payload) => unwrap(apiClient.put('/admin/branding', payload))
};
