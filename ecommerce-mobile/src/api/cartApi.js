import { apiClient, unwrap } from './client';

export const cartApi = {
  get: () => unwrap(apiClient.get('/cart')),
  addItem: (payload) => unwrap(apiClient.post('/cart/items', payload)),
  updateItem: (itemId, quantity) => unwrap(apiClient.put(`/cart/items/${itemId}`, { quantity })),
  removeItem: (itemId) => unwrap(apiClient.delete(`/cart/items/${itemId}`)),
  applyCoupon: (code) => unwrap(apiClient.post('/cart/coupon', null, { params: { code } })),
  removeCoupon: () => unwrap(apiClient.delete('/cart/coupon'))
};
