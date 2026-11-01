import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../../api/authApi';

async function persistSession(auth) {
  await AsyncStorage.setItem('accessToken', auth.accessToken);
  await AsyncStorage.setItem('refreshToken', auth.refreshToken);
  const customer = { id: auth.userId, email: auth.email, fullName: auth.fullName };
  await AsyncStorage.setItem('customer', JSON.stringify(customer));
  return customer;
}

export const bootstrapAuth = createAsyncThunk('auth/bootstrap', async () => {
  const raw = await AsyncStorage.getItem('customer');
  return raw ? JSON.parse(raw) : null;
});

export const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try { return await persistSession(await authApi.register(payload)); }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Registration failed'); }
});

export const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try { return await persistSession(await authApi.login(payload)); }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Invalid email or password'); }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  try { if (refreshToken) await authApi.logout(refreshToken); } catch { /* best-effort */ }
  await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'customer']);
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { customer: null, bootstrapped: false, status: 'idle', error: null },
  reducers: {
    clearAuthError(state) { state.error = null; },
    sessionExpired(state) { state.customer = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapAuth.fulfilled, (state, action) => { state.customer = action.payload; state.bootstrapped = true; })
      .addCase(register.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(register.fulfilled, (state, action) => { state.status = 'succeeded'; state.customer = action.payload; })
      .addCase(register.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(login.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { state.status = 'succeeded'; state.customer = action.payload; })
      .addCase(login.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(logout.fulfilled, (state) => { state.customer = null; });
  }
});

export const { clearAuthError, sessionExpired } = authSlice.actions;
export default authSlice.reducer;
