import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartApi } from '../../api/cartApi';

export const fetchCart = createAsyncThunk('cart/fetch', async () => cartApi.get());
export const addToCart = createAsyncThunk('cart/addItem', async (payload) => cartApi.addItem(payload));
export const updateCartItem = createAsyncThunk('cart/updateItem', async ({ itemId, quantity }) => cartApi.updateItem(itemId, quantity));
export const removeCartItem = createAsyncThunk('cart/removeItem', async (itemId) => cartApi.removeItem(itemId));
export const applyCoupon = createAsyncThunk('cart/applyCoupon', async (code, { rejectWithValue }) => {
  try { return await cartApi.applyCoupon(code); }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Invalid coupon'); }
});
export const removeCoupon = createAsyncThunk('cart/removeCoupon', async () => cartApi.removeCoupon());

const initialState = {
  cart: { items: [], subtotal: 0, discount: 0, total: 0, appliedCouponCode: null },
  status: 'idle',
  couponError: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: { clearCouponError(state) { state.couponError = null; } },
  extraReducers: (builder) => {
    const setCart = (state, action) => { state.cart = action.payload; state.status = 'succeeded'; };
    builder
      .addCase(fetchCart.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchCart.fulfilled, setCart)
      .addCase(addToCart.fulfilled, setCart)
      .addCase(updateCartItem.fulfilled, setCart)
      .addCase(removeCartItem.fulfilled, setCart)
      .addCase(applyCoupon.fulfilled, (state, action) => { state.cart = action.payload; state.couponError = null; })
      .addCase(applyCoupon.rejected, (state, action) => { state.couponError = action.payload; })
      .addCase(removeCoupon.fulfilled, setCart);
  }
});

export const cartItemCount = (state) => state.cart.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const { clearCouponError } = cartSlice.actions;
export default cartSlice.reducer;
