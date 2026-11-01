import { apiClient, unwrap } from './client';

export const authApi = {
  login: (usernameOrEmail, password) => unwrap(apiClient.post('/auth/admin/login', { usernameOrEmail, password })),
  logout: (refreshToken) => unwrap(apiClient.post('/auth/logout', { refreshToken })),
  changePassword: (payload) => unwrap(apiClient.post('/auth/change-password', payload))
};
