import { apiClient, unwrap } from './client';

export const authApi = {
  register: (payload) => unwrap(apiClient.post('/auth/register', payload)),
  login: (payload) => unwrap(apiClient.post('/auth/login', payload)),
  refreshToken: (refreshToken) => unwrap(apiClient.post('/auth/refresh-token', { refreshToken })),
  forgotPassword: (email) => unwrap(apiClient.post('/auth/forgot-password', { email })),
  resetPassword: (payload) => unwrap(apiClient.post('/auth/reset-password', payload)),
  changePassword: (payload) => unwrap(apiClient.post('/auth/change-password', payload)),
  logout: (refreshToken) => unwrap(apiClient.post('/auth/logout', { refreshToken }))
};
