import { apiClient, unwrap } from './client';

export const smtpConfigApi = {
  getAll: () => unwrap(apiClient.get('/admin/smtp-config')),
  create: (payload) => unwrap(apiClient.post('/admin/smtp-config', payload)),
  update: (id, payload) => unwrap(apiClient.put(`/admin/smtp-config/${id}`, payload)),
  remove: (id) => unwrap(apiClient.delete(`/admin/smtp-config/${id}`)),
  test: (id, toEmail) => unwrap(apiClient.post(`/admin/smtp-config/${id}/test`, null, { params: { toEmail } }))
};
