import { apiClient, unwrap } from './client';

export const addressApi = {
  getAll: () => unwrap(apiClient.get('/addresses')),
  create: (payload) => unwrap(apiClient.post('/addresses', payload)),
  remove: (id) => unwrap(apiClient.delete(`/addresses/${id}`)),
  setDefault: (id) => unwrap(apiClient.patch(`/addresses/${id}/default`))
};
