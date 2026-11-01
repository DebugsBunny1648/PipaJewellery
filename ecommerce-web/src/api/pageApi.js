import { apiClient, unwrap } from './client';

export const pageApi = {
  getBySlug: (slug) => unwrap(apiClient.get(`/pages/${slug}`))
};
