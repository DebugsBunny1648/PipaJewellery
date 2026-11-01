import { apiClient, unwrap } from './client';

export const productApi = {
  search: (params) => unwrap(apiClient.get('/products', { params })),
  getById: (id) => unwrap(apiClient.get(`/products/${id}`)),
  create: (payload) => unwrap(apiClient.post('/admin/products', payload)),
  update: (id, payload) => unwrap(apiClient.put(`/admin/products/${id}`, payload)),
  remove: (id) => unwrap(apiClient.delete(`/admin/products/${id}`)),
  updateStatus: (id, active) => unwrap(apiClient.patch(`/admin/products/${id}/status`, null, { params: { active } })),
  addImage: (id, file, isPrimary) => {
    const form = new FormData();
    form.append('file', file);
    return unwrap(apiClient.post(`/admin/products/${id}/images`, form, {
      params: { isPrimary },
      headers: { 'Content-Type': 'multipart/form-data' }
    }));
  },
  deleteImage: (id, imageId) => unwrap(apiClient.delete(`/admin/products/${id}/images/${imageId}`))
};
