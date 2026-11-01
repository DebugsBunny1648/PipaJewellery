import { apiClient, unwrap } from './client';

export const cmsApi = {
  getHomepage: (device = 'WEB') => unwrap(apiClient.get('/cms/homepage', { params: { device } }))
};
