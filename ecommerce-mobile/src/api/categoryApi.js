import { apiClient, unwrap } from './client';

export const categoryApi = {
  getTree: () => unwrap(apiClient.get('/categories/tree')),
  getAll: () => unwrap(apiClient.get('/categories'))
};
