import { apiClient, unwrap } from './client';

export const reviewApi = {
  getByProduct: (productId) => unwrap(apiClient.get(`/reviews/product/${productId}`))
};
