import { apiClient, unwrap } from './client';

export const cmsApi = {
  getHomepage: () => unwrap(apiClient.get('/cms/homepage', { params: { device: 'MOBILE' } }))
};
