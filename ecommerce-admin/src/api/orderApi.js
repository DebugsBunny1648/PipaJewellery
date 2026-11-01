import { apiClient, unwrap } from './client';

export const orderApi = {
  getAll: (page = 0, size = 20) => unwrap(apiClient.get('/admin/orders', { params: { page, size } })),
  getById: (id) => unwrap(apiClient.get(`/admin/orders/${id}`)),
  updateStatus: (id, status, remarks) => unwrap(apiClient.patch(`/admin/orders/${id}/status`, null, { params: { status, remarks } })),
  getShipping: (orderId) => unwrap(apiClient.get(`/admin/orders/${orderId}/shipping`)),
  updateShipping: (orderId, params) => unwrap(apiClient.put(`/admin/orders/${orderId}/shipping`, null, { params })),
  getPayment: (orderId) => unwrap(apiClient.get(`/admin/orders/${orderId}/payment`)),
  updatePaymentStatus: (orderId, status, transactionId) =>
    unwrap(apiClient.patch(`/admin/orders/${orderId}/payment/status`, null, { params: { status, transactionId } })),
  refundPayment: (orderId, amount) => unwrap(apiClient.post(`/admin/orders/${orderId}/payment/refund`, null, { params: { amount } }))
};
