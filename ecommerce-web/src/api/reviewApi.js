import { apiClient, unwrap } from './client';

export const reviewApi = {
  getByProduct: (productId) => unwrap(apiClient.get(`/reviews/product/${productId}`)),
  create: (productId, { rating, title, comment }) =>
    unwrap(apiClient.post(`/reviews/product/${productId}`, null, { params: { rating, title, comment } }))
};
