import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistApi } from '../../api/wishlistApi';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try { return await wishlistApi.get(); } catch { return rejectWithValue([]); }
});

export const toggleWishlist = createAsyncThunk('wishlist/toggle', async (productId, { getState }) => {
  const exists = getState().wishlist.items.some((p) => p.id === productId);
  if (exists) { await wishlistApi.remove(productId); } else { await wishlistApi.add(productId); }
  return wishlistApi.get();
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => { state.items = action.payload; state.status = 'succeeded'; })
      .addCase(fetchWishlist.rejected, (state) => { state.items = []; state.status = 'failed'; })
      .addCase(toggleWishlist.fulfilled, (state, action) => { state.items = action.payload; });
  }
});

export default wishlistSlice.reducer;
