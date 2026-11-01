import { createSlice, nanoid } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { toasts: [] },
  reducers: {
    showToast: {
      reducer(state, action) { state.toasts.push(action.payload); },
      prepare(message, tone = 'default') { return { payload: { id: nanoid(), message, tone } }; }
    },
    dismissToast(state, action) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    }
  }
});

export const { showToast, dismissToast } = uiSlice.actions;
export default uiSlice.reducer;
