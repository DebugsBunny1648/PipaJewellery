import { apiClient, unwrap } from './client';

export const appConfigApi = {
  getMobileConfig: () => unwrap(apiClient.get('/app-config/mobile')),
  getBranding: () => unwrap(apiClient.get('/app-config/branding/MOBILE'))
};
