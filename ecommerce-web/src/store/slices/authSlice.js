import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi';

const storedCustomer = (() => {
  try { return JSON.parse(localStorage.getItem('customer')); } catch { return null; }
})();

function persistSession(auth) {
  localStorage.setItem('accessToken', auth.accessToken);
  localStorage.setItem('refreshToken', auth.refreshToken);
  const customer = { id: auth.userId, email: auth.email, fullName: auth.fullName };
  localStorage.setItem('customer', JSON.stringify(customer));
  return customer;
}

export const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try { return persistSession(await authApi.register(payload)); }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Registration failed'); }
});

export const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try { return persistSession(await authApi.login(payload)); }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Invalid email or password'); }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  try { if (refreshToken) await authApi.logout(refreshToken); } catch { /* best-effort */ }
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('customer');
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    customer: storedCustomer,
    status: 'idle',
    error: null
  },
  reducers: {
    clearAuthError(state) { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(register.fulfilled, (state, action) => { state.status = 'succeeded'; state.customer = action.payload; })
      .addCase(register.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(login.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { state.status = 'succeeded'; state.customer = action.payload; })
      .addCase(login.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(logout.fulfilled, (state) => { state.customer = null; });
  }
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
