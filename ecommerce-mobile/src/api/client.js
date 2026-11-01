import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  Constants.expoConfig?.extra?.apiBaseUrl ||
  'http://localhost:8080/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

function randomToken() {
  return 'guest-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 12);
}

let cachedGuestToken = null;
async function getGuestToken() {
  if (cachedGuestToken) return cachedGuestToken;
  let token = await AsyncStorage.getItem('guestToken');
  if (!token) {
    token = randomToken();
    await AsyncStorage.setItem('guestToken', token);
  }
  cachedGuestToken = token;
  return token;
}

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers['X-Guest-Token'] = await getGuestToken();
  return config;
});

let isRefreshing = false;
let pendingQueue = [];
function processQueue(error, token = null) {
  pendingQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  pendingQueue = [];
}

/** Set by the auth slice so a refresh failure can force a sign-out + navigation reset. */
let onSessionExpired = () => {};
export function setSessionExpiredHandler(fn) {
  onSessionExpired = fn;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (error.response?.status === 401 && !originalRequest._retry && refreshToken) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => pendingQueue.push({ resolve, reject })).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const { data } = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = data.data;
        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('refreshToken', newRefreshToken);
        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'customer']);
        onSessionExpired();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export function unwrap(promise) {
  return promise.then((res) => res.data.data);
}
