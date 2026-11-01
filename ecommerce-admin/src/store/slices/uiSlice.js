import { createSlice, nanoid } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { toasts: [], sidebarOpen: false },
  reducers: {
    showToast: {
      reducer(state, action) { state.toasts.push(action.payload); },
      prepare(message, tone = 'default') { return { payload: { id: nanoid(), message, tone } }; }
    },
    dismissToast(state, action) { state.toasts = state.toasts.filter((t) => t.id !== action.payload); },
    toggleSidebar(state) { state.sidebarOpen = !state.sidebarOpen; }
  }
});

export const { showToast, dismissToast, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;
