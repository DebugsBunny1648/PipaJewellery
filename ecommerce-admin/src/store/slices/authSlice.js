import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi';

const storedUser = (() => {
  try { return JSON.parse(localStorage.getItem('adminUser')); } catch { return null; }
})();

export const login = createAsyncThunk('auth/login', async ({ usernameOrEmail, password }, { rejectWithValue }) => {
  try {
    const auth = await authApi.login(usernameOrEmail, password);
    localStorage.setItem('adminAccessToken', auth.accessToken);
    localStorage.setItem('adminRefreshToken', auth.refreshToken);
    const user = { id: auth.userId, email: auth.email, fullName: auth.fullName, roles: auth.roles };
    localStorage.setItem('adminUser', JSON.stringify(user));
    return user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Invalid credentials');
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  const refreshToken = localStorage.getItem('adminRefreshToken');
  try { if (refreshToken) await authApi.logout(refreshToken); } catch { /* best-effort */ }
  localStorage.removeItem('adminAccessToken');
  localStorage.removeItem('adminRefreshToken');
  localStorage.removeItem('adminUser');
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: storedUser, status: 'idle', error: null },
  reducers: { clearAuthError(state) { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { state.status = 'succeeded'; state.user = action.payload; })
      .addCase(login.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(logout.fulfilled, (state) => { state.user = null; });
  }
});

export const { clearAuthError } = authSlice.actions;

/** A role hierarchy helper — SUPER_ADMIN implicitly has every permission. */
export function hasRole(user, ...roles) {
  if (!user) return false;
  const userRoles = user.roles?.map((r) => r.replace('ROLE_', '')) || [];
  return userRoles.includes('SUPER_ADMIN') || roles.some((r) => userRoles.includes(r));
}

export default authSlice.reducer;
