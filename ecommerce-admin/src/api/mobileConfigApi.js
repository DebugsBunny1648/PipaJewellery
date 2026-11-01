import { apiClient, unwrap } from './client';

export const mobileConfigApi = {
  get: () => unwrap(apiClient.get('/admin/mobile-config')),
  update: (payload) => unwrap(apiClient.put('/admin/mobile-config', payload))
};
