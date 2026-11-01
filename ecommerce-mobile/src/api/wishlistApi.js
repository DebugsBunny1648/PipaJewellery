import { apiClient, unwrap } from './client';

export const wishlistApi = {
  get: () => unwrap(apiClient.get('/wishlist')),
  add: (productId) => unwrap(apiClient.post(`/wishlist/${productId}`)),
  remove: (productId) => unwrap(apiClient.delete(`/wishlist/${productId}`))
};
