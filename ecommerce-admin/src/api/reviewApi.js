import { apiClient, unwrap } from './client';

export const reviewApi = {
  approve: (id, approved) => unwrap(apiClient.patch(`/admin/reviews/${id}/approve`, null, { params: { approved } })),
  remove: (id) => unwrap(apiClient.delete(`/admin/reviews/${id}`)),
  getByProduct: (productId) => unwrap(apiClient.get(`/reviews/product/${productId}`))
};
