import { apiClient, unwrap } from './client';
export const dashboardApi = { getSummary: () => unwrap(apiClient.get('/admin/dashboard/summary')) };
