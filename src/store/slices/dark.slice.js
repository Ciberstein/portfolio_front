import { createSlice } from '@reduxjs/toolkit';

const darkSlice = createSlice({
  name: 'dark',
  initialState: null,
  reducers: {
    setDark: (state, action) =>
      action.payload,
  },
});

export const { setDark } = darkSlice.actions;

export default darkSlice.reducer;

const handleDark = status => status
  ? document.body.classList.add('dark')
  : document.body.classList.remove('dark')

export const darkThunk = () => dispatch => {
  const local = localStorage.getItem('dark');

  if (local) {
    const value = local === 'true';
    dispatch(setDark(value));
    handleDark(value)
  } else {
    localStorage.setItem('dark', true);
  }
};
