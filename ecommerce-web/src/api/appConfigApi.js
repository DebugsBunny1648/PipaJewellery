import { apiClient, unwrap } from './client';

export const appConfigApi = {
  getBranding: (platform = 'WEB') => unwrap(apiClient.get(`/app-config/branding/${platform}`)),
  getSiteConfig: () => unwrap(apiClient.get('/app-config/site'))
};
