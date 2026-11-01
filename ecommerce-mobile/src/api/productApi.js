import { apiClient, unwrap } from './client';

export const productApi = {
  search: (params) => unwrap(apiClient.get('/products', { params })),
  getById: (id) => unwrap(apiClient.get(`/products/${id}`)),
  getBySlug: (slug) => unwrap(apiClient.get(`/products/slug/${slug}`)),
  getFeatured: () => unwrap(apiClient.get('/products/featured')),
  getNewArrivals: () => unwrap(apiClient.get('/products/new-arrivals')),
  getBestSellers: () => unwrap(apiClient.get('/products/best-sellers')),
  getRelated: (id) => unwrap(apiClient.get(`/products/${id}/related`))
};
