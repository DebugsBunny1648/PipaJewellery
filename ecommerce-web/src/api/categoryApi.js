import { apiClient, unwrap } from './client';

export const categoryApi = {
  getAll: () => unwrap(apiClient.get('/categories')),
  getTree: () => unwrap(apiClient.get('/categories/tree')),
  getById: (id) => unwrap(apiClient.get(`/categories/${id}`))
};
